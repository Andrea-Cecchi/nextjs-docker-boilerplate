#!/usr/bin/env python3
"""
FarMix Worker - ETL per Liste di Trasparenza AIFA
Scarica e processa i dati CSV dei farmaci rimborsati
"""


import asyncio
import os
import sys
import logging
import zipfile
import io
import traceback
from datetime import datetime, date
from decimal import Decimal, InvalidOperation
from typing import Optional, Dict, Any, List

import requests
import csv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
from dotenv import load_dotenv

# Carica variabili ambiente
load_dotenv()

# Configurazione logging (ritardata per permettere --help senza log)
def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('/tmp/farmix-worker.log', mode='a')
        ]
    )
    return logging.getLogger(__name__)

# Configurazione
DATABASE_URL = os.getenv("DATABASE_URL")
AIFA_CSV_URL = os.getenv("AIFA_CSV_URL", None)  # None = auto-discovery
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "120"))
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "1000"))

# Logger globale (inizializzato dopo)
logger = None

class AIFAProcessor:
    """Processore per i dati AIFA"""
    
    def __init__(self):
        self.engine = create_async_engine(
            DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
            echo=False,
            pool_size=5,
            max_overflow=10
        )
        
    async def find_all_historical_files(self) -> List[str]:
        """Trova tutti i file storici disponibili su AIFA"""
        import re
        
        logger.info("Ricerca di tutti i file storici AIFA...")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
            
            response = requests.get("https://www.aifa.gov.it/storico-liste-di-trasparenza", 
                                   headers=headers, timeout=30)
            response.raise_for_status()
            
            # Cerca tutti i link ai file ZIP
            zip_pattern = r'href="(/documents/[^"]*\.zip)"'
            matches = re.findall(zip_pattern, response.text)
            
            # Costruisci URL completi
            full_urls = []
            for match in matches:
                full_url = f"https://www.aifa.gov.it{match}"
                full_urls.append(full_url)
            
            # Ordina per data (più recenti primi)
            # Estrae la data dal filename e ordina
            def extract_date(url):
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
                if date_match:
                    try:
                        return datetime.strptime(date_match.group(1), '%Y-%m-%d')
                    except:
                        return datetime.min
                return datetime.min
            
            full_urls.sort(key=extract_date, reverse=True)
            
            logger.info(f"Trovati {len(full_urls)} file storici")
            for i, url in enumerate(full_urls[:5]):  # Log primi 5
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
                date_str = date_match.group(1) if date_match else "Data sconosciuta"
                logger.info(f"  {i+1}. {date_str}")
            
            return full_urls
            
        except Exception as e:
            logger.error(f"Errore nella ricerca file storici: {e}")
            return []

    async def find_latest_aifa_file(self) -> str:
        """Trova l'ultimo file AIFA disponibile"""
        from datetime import datetime, timedelta
        
        # Prima prova il file CSV più recente (non ZIP)
        # Nota: AIFA non supporta HEAD requests, proviamo una GET range limitata
        csv_url = "https://www.aifa.gov.it/documents/20142/825643/Lista_farmaci_equivalenti.csv"
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Range': 'bytes=0-1024'  # Solo i primi 1KB per testare
            }
            response = requests.get(csv_url, headers=headers, timeout=10)
            if response.status_code in [200, 206]:  # 206 = Partial Content
                logger.info(f"Trovato file CSV corrente: {csv_url}")
                return csv_url
        except:
            pass
        
        # Pattern per file ZIP storici (basato sui pattern reali osservati)
        zip_pattern = "https://www.aifa.gov.it/documents/20142/825643/{date}_liste_farmaci_equivalenti.zip"
        
        # Genera date candidate basate sui pattern AIFA reali
        current_date = datetime.now()
        candidate_dates = []
        
        # Date specifiche osservate (15-17 del mese)
        for months_back in range(8):  # Ultimi 8 mesi
            base_date = current_date - timedelta(days=30 * months_back)
            
            # 15, 16, 17 del mese (pattern più comuni)
            for day in [15, 16, 17]:
                try:
                    test_date = base_date.replace(day=day)
                    candidate_dates.append(test_date)
                except ValueError:
                    # Giorno non valido per il mese (es. 31 febbraio)
                    continue
        
        # Aggiungi anche il primo e ultimo giorno del mese
        for months_back in range(4):  # Ultimi 4 mesi
            base_date = current_date - timedelta(days=30 * months_back)
            try:
                # Primo del mese
                first_day = base_date.replace(day=1)
                candidate_dates.append(first_day)
                
                # Ultimo giorno del mese
                if base_date.month == 12:
                    next_month = base_date.replace(year=base_date.year + 1, month=1, day=1)
                else:
                    next_month = base_date.replace(month=base_date.month + 1, day=1)
                last_day = next_month - timedelta(days=1)
                candidate_dates.append(last_day)
            except ValueError:
                continue
        
        # Ordina per data decrescente (più recenti primi)
        candidate_dates = sorted(set(candidate_dates), reverse=True)
        
        # Testa le date candidate
        for test_date in candidate_dates:
            date_str = test_date.strftime("%Y-%m-%d")
            test_url = zip_pattern.format(date=date_str)
            
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Range': 'bytes=0-1024'  # Solo i primi 1KB per testare
                }
                response = requests.get(test_url, headers=headers, timeout=3)
                if response.status_code in [200, 206]:  # 206 = Partial Content
                    logger.info(f"Trovato file ZIP datato: {test_url}")
                    return test_url
            except:
                continue
        
        # Se non trova nulla, usa l'URL di fallback che sappiamo funziona
        fallback_url = "https://www.aifa.gov.it/documents/20142/825643/2025-04-14_liste_farmaci_equivalenti.zip"
        logger.warning(f"Nessun file recente trovato, uso URL di fallback: {fallback_url}")
        return fallback_url

    async def download_and_extract_csv(self, url: str) -> List[Dict[str, str]]:
        """Scarica il file ZIP o CSV e ne estrae il contenuto"""
        logger.info(f"Scaricando dati da: {url}")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            
            logger.info(f"Download completato, dimensione: {len(response.content)} bytes")
            
            # Determina se è un file ZIP o CSV
            if url.endswith('.csv'):
                # File CSV diretto
                logger.info("Processando file CSV diretto")
                return self._parse_csv_content(response.content)
            else:
                # File ZIP - estrai CSV
                logger.info("Estraendo CSV da file ZIP")
                with zipfile.ZipFile(io.BytesIO(response.content)) as zip_file:
                    csv_files = [name for name in zip_file.namelist() if name.endswith('.csv')]
                    
                    if not csv_files:
                        raise ValueError("Nessun file CSV trovato nell'archivio ZIP")
                    
                    csv_filename = csv_files[0]
                    logger.info(f"Estraendo file CSV: {csv_filename}")
                    
                    with zip_file.open(csv_filename) as csv_file:
                        csv_content = csv_file.read()
                        return self._parse_csv_content(csv_content)
                    
        except requests.RequestException as e:
            logger.error(f"Errore durante il download: {e}")
            raise
        except Exception as e:
            logger.error(f"Errore durante l'estrazione: {e}")
            raise
    
    def _parse_csv_content(self, csv_content: bytes) -> List[Dict[str, str]]:
        """Parsa il contenuto CSV provando diversi encoding e separatori"""
        # Prova diversi encoding e separatori
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        separators = [';', ',', '\t']
        
        for encoding in encodings:
            for sep in separators:
                try:
                    text_content = csv_content.decode(encoding)
                    
                    # Parse CSV manualmente
                    csv_reader = csv.DictReader(
                        io.StringIO(text_content), 
                        delimiter=sep
                    )
                    
                    rows = list(csv_reader)
                    
                    if len(rows) > 0 and len(csv_reader.fieldnames or []) > 5:
                        logger.info(f"CSV caricato con successo: {len(rows)} righe, {len(csv_reader.fieldnames)} colonne")
                        logger.info(f"Encoding: {encoding}, Separatore: '{sep}'")
                        logger.info(f"Colonne: {csv_reader.fieldnames}")
                        return rows
                        
                except Exception as e:
                    logger.debug(f"Tentativo fallito - Encoding: {encoding}, Sep: '{sep}' - {e}")
                    continue
        
        raise ValueError("Impossibile leggere il file CSV con nessun formato testato")
    
    def extract_date_from_url(self, url: str) -> Optional[date]:
        """Estrae la data dal nome del file nell'URL"""
        import re
        
        # Cerca pattern date nel formato YYYY-MM-DD
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
        if date_match:
            try:
                return datetime.strptime(date_match.group(1), '%Y-%m-%d').date()
            except:
                pass
        
        # Cerca pattern date nel formato YYYYMMDD
        date_match = re.search(r'(\d{8})', url)
        if date_match:
            try:
                return datetime.strptime(date_match.group(1), '%Y%m%d').date()
            except:
                pass
        
        return None

    def normalize_column_names(self, rows: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Normalizza i nomi delle colonne per il mapping"""
        if not rows:
            return []
        
        # Mapping colonne comune -> nostro schema
        column_mapping = {
            # Varianti per Codice AIC
            'aic': 'aic',
            'codice_aic': 'aic',
            'codicare': 'aic',
            'auth_code': 'aic',
            'authorization_code': 'aic',
            
            # Varianti per Principio Attivo
            'principio_attivo': 'principio_attivo',
            'principioattivo': 'principio_attivo',
            'active_ingredient': 'principio_attivo',
            'active_substance': 'principio_attivo',
            'molecule': 'principio_attivo',
            'sostanza_attiva': 'principio_attivo',
            
            # Varianti per Nome Commerciale/Farmaco
            'nome_commerciale': 'nome_commerciale',
            'nomecommerciale': 'nome_commerciale',
            'brand_name': 'nome_commerciale',
            'trade_name': 'nome_commerciale',
            'denominazione': 'nome_commerciale',
            'farmaco': 'nome_commerciale',
            
            # Varianti per Confezione
            'confezione': 'confezione',
            'package': 'confezione',
            'pack': 'confezione',
            'formato': 'confezione',
            'dosaggio': 'confezione',
            
            # Varianti per Confezione di Riferimento
            'confezione_di_riferimento': 'confezione_di_riferimento',
            'confezione_riferimento': 'confezione_di_riferimento',
            'reference_package': 'confezione_di_riferimento',
            
            # Varianti per Codice ATC
            'atc': 'atc',
            'codice_atc': 'atc',
            'atc_code': 'atc',
            
            # Varianti per Titolare AIC/Ditta
            'titolare_aic': 'titolare_aic',
            'titolareaic': 'titolare_aic',
            'holder': 'titolare_aic',
            'company': 'titolare_aic',
            'azienda': 'titolare_aic',
            'ditta': 'titolare_aic',
            
            # Varianti per Prezzo Riferimento SSN
            'prezzo_rimborso': 'prezzo_riferimento_ssn',
            'prezzorimborso': 'prezzo_riferimento_ssn',
            'prezzo_riferimento_ssn': 'prezzo_riferimento_ssn',
            'prezzo_riferimento': 'prezzo_riferimento_ssn',
            'prezzo_ssn': 'prezzo_riferimento_ssn',
            'prezzo': 'prezzo_riferimento_ssn',
            'price': 'prezzo_riferimento_ssn',
            'costo': 'prezzo_riferimento_ssn',
            
            # Varianti per Prezzo Pubblico (incluse date variabili)
            'prezzo_pubblico': 'prezzo_pubblico',
            'prezzo_al_pubblico': 'prezzo_pubblico',
            'public_price': 'prezzo_pubblico',
            # Pattern per date variabili - questi verranno gestiti dalla logica speciale sopra
            'prezzo_pubblico_14_aprile_2025': 'prezzo_pubblico',
            'prezzo_pubblico_15_maggio_2025': 'prezzo_pubblico',
            'prezzo_pubblico_16_giugno_2025': 'prezzo_pubblico',
            
            # Varianti per Differenza
            'differenza': 'differenza',
            'diff': 'differenza',
            'difference': 'differenza',
            'scarto': 'differenza',
            
            # Varianti per Note
            'nota': 'nota',
            'note': 'nota',
            'notes': 'nota',
            'osservazioni': 'nota',
            'annotazioni': 'nota',
            
            # Varianti per Codice Gruppo Equivalenza
            'codice_gruppo_equivalenza': 'codice_gruppo_equivalenza',
            'gruppo_equivalenza': 'codice_gruppo_equivalenza',
            'codice_equivalenza': 'codice_gruppo_equivalenza',
            'equivalence_group': 'codice_gruppo_equivalenza',
            'equivalence_code': 'codice_gruppo_equivalenza',
            
            # Varianti per Data
            'data_decorrenza': 'data_decorrenza',
            'datadecorrenza': 'data_decorrenza',
            'data': 'data_decorrenza',
            'date': 'data_decorrenza',
            'effective_date': 'data_decorrenza'
        }
        
        # Mappa i nomi delle colonne
        original_keys = list(rows[0].keys())
        normalized_columns = {}
        
        for col in original_keys:
            normalized_col = col.lower().strip().replace(' ', '_').replace('-', '_').replace('.', '_')
            
            # Handle special cases for date-specific columns FIRST
            if normalized_col.startswith('prezzo_pubblico') and any(char.isdigit() for char in normalized_col):
                # Any column starting with "prezzo_pubblico" and containing digits (dates)
                mapped_col = 'prezzo_pubblico'
            elif 'prezzo_riferimento' in normalized_col or 'prezzo_rimborso' in normalized_col:
                mapped_col = 'prezzo_riferimento_ssn'
            elif 'confezione_di_riferimento' in normalized_col:
                mapped_col = 'confezione_di_riferimento'
            elif 'codice_gruppo_equivalenza' in normalized_col:
                mapped_col = 'codice_gruppo_equivalenza'
            else:
                # Try both the normalized column name and direct mapping
                mapped_col = column_mapping.get(normalized_col, normalized_col)
            
            normalized_columns[col] = mapped_col
        
        # Crea nuove righe con colonne rinominate
        normalized_rows = []
        for row in rows:
            new_row = {}
            for old_key, new_key in normalized_columns.items():
                new_row[new_key] = row.get(old_key, '')
            normalized_rows.append(new_row)
        
        logger.info(f"Colonne mappate: {normalized_columns}")
        return normalized_rows
    
    def clean_and_validate_data(self, rows: List[Dict[str, str]], file_date: Optional[date] = None) -> List[Dict[str, str]]:
        """Pulisce e valida i dati"""
        logger.info("Pulizia e validazione dati in corso...")
        
        if not rows:
            return []
        
        original_count = len(rows)
        cleaned_rows = []
        default_date = file_date or date.today()
        
        for i, row in enumerate(rows):
            # Pulisci ogni riga
            cleaned_row = {}
            
            # AIC - deve essere presente e valido (almeno 6 cifre)
            aic = str(row.get('aic', '')).strip()
            if not aic or len(aic) < 6 or not aic.replace('/', '').replace('-', '').isdigit():
                continue  # Salta righe con AIC non valido
            # Normalizza AIC (prende solo le prime 9 cifre se più lungo)
            aic_clean = ''.join(c for c in aic if c.isdigit())
            if len(aic_clean) >= 6:
                cleaned_row['aic'] = aic_clean[:9].ljust(9, '0')  # Pad con zeri se necessario
            else:
                if i < 3:  # Log solo per le prime 3 righe
                    logger.info(f"DEBUG - Riga {i}: AIC clean troppo corto '{aic_clean}', skip")
                continue
            
            # Nome commerciale - obbligatorio
            nome = str(row.get('nome_commerciale', '')).strip()
            if not nome or len(nome) < 2:
                continue  # Salta righe senza nome valido
            cleaned_row['nome_commerciale'] = nome
            
            # Principio attivo
            cleaned_row['principio_attivo'] = str(row.get('principio_attivo', 'Non specificato')).strip() or 'Non specificato'
            
            # Confezione
            cleaned_row['confezione'] = str(row.get('confezione', 'Non specificato')).strip() or 'Non specificato'
            
            # Confezione di Riferimento
            confezione_rif = str(row.get('confezione_di_riferimento', '')).strip()
            cleaned_row['confezione_di_riferimento'] = confezione_rif if confezione_rif and confezione_rif not in ['nan', 'None', ''] else cleaned_row['confezione']
            
            # Codice ATC
            atc = str(row.get('atc', '')).strip()
            cleaned_row['atc'] = atc if atc and atc not in ['nan', 'None', ''] else None
            
            # Titolare AIC
            titolare = str(row.get('titolare_aic', '')).strip()
            cleaned_row['titolare_aic'] = titolare if titolare and titolare not in ['nan', 'None', ''] else None
            
            # Prezzo Riferimento SSN
            prezzo_ssn_str = str(row.get('prezzo_riferimento_ssn', '')).strip()
            prezzo_ssn = None
            if prezzo_ssn_str and prezzo_ssn_str not in ['', 'nan', 'None']:
                try:
                    clean_price = prezzo_ssn_str.replace(',', '.')
                    clean_price = ''.join(c for c in clean_price if c.isdigit() or c == '.')
                    if clean_price:
                        prezzo_ssn = float(clean_price)
                except:
                    pass
            cleaned_row['prezzo_riferimento_ssn'] = prezzo_ssn
            
            # Prezzo Pubblico
            prezzo_pub_str = str(row.get('prezzo_pubblico', '')).strip()
            prezzo_pub = None
            if prezzo_pub_str and prezzo_pub_str not in ['', 'nan', 'None']:
                try:
                    clean_price = prezzo_pub_str.replace(',', '.')
                    clean_price = ''.join(c for c in clean_price if c.isdigit() or c == '.')
                    if clean_price:
                        prezzo_pub = float(clean_price)
                except:
                    pass
            cleaned_row['prezzo_pubblico'] = prezzo_pub
            
            # Differenza Prezzo
            diff_str = str(row.get('differenza', '')).strip()
            diff = None
            if diff_str and diff_str not in ['', 'nan', 'None']:
                try:
                    clean_diff = diff_str.replace(',', '.')
                    clean_diff = ''.join(c for c in clean_diff if c.isdigit() or c == '.' or c == '-' or c == '+')
                    if clean_diff:
                        diff = float(clean_diff)
                except:
                    pass
            cleaned_row['differenza'] = diff
            
            # Note
            nota = str(row.get('nota', '')).strip()
            cleaned_row['nota'] = nota if nota and nota not in ['nan', 'None', ''] else None
            
            # Codice Gruppo Equivalenza
            codice_eq = str(row.get('codice_gruppo_equivalenza', '')).strip()
            cleaned_row['codice_gruppo_equivalenza'] = codice_eq if codice_eq and codice_eq not in ['nan', 'None', ''] else None
            
            # Mantieni prezzo_rimborso per compatibilità (usa prezzo_riferimento_ssn)
            cleaned_row['prezzo_rimborso'] = prezzo_ssn
            
            # Data
            data_str = str(row.get('data_decorrenza', '')).strip()
            data = default_date
            if data_str and data_str not in ['', 'nan', 'None']:
                for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y', '%Y/%m/%d']:
                    try:
                        data = datetime.strptime(data_str, fmt).date()
                        break
                    except:
                        continue
            cleaned_row['data_decorrenza'] = data
            
            cleaned_rows.append(cleaned_row)
        
        cleaned_count = len(cleaned_rows)
        logger.info(f"Pulizia completata: {original_count} -> {cleaned_count} righe ({original_count - cleaned_count} rimosse)")
        
        return cleaned_rows
    
    async def upsert_drugs_batch(self, session: AsyncSession, drugs_batch: List[Dict[str, Any]]) -> int:
        """Inserisce/aggiorna un batch di farmaci"""
        if not drugs_batch:
            return 0
        
        # Query per upsert dei farmaci
        upsert_drug_query = text("""
            INSERT INTO drug (
                id, "activeSubstance", "brandName", pack, holder,
                "referencePackage", atc, "ssnReferencePrice", "publicPrice",
                "priceDifference", note, "equivalenceGroupCode"
            )
            VALUES (
                :id, :active_substance, :brand_name, :pack, :holder,
                :reference_package, :atc, :ssn_reference_price, :public_price,
                :price_difference, :note, :equivalence_group_code
            )
            ON CONFLICT (id) DO UPDATE SET
                "activeSubstance" = EXCLUDED."activeSubstance",
                "brandName" = EXCLUDED."brandName",
                pack = EXCLUDED.pack,
                holder = EXCLUDED.holder,
                "referencePackage" = EXCLUDED."referencePackage",
                atc = EXCLUDED.atc,
                "ssnReferencePrice" = EXCLUDED."ssnReferencePrice",
                "publicPrice" = EXCLUDED."publicPrice",
                "priceDifference" = EXCLUDED."priceDifference",
                note = EXCLUDED.note,
                "equivalenceGroupCode" = EXCLUDED."equivalenceGroupCode"
        """)
        
        try:
            await session.execute(upsert_drug_query, drugs_batch)
            return len(drugs_batch)
        except Exception as e:
            logger.error(f"Errore nell'upsert batch farmaci: {e}")
            raise
    
    async def upsert_prices_batch(self, session: AsyncSession, prices_batch: List[Dict[str, Any]]) -> int:
        """Inserisce/aggiorna un batch di prezzi solo se sono effettivamente cambiati"""
        if not prices_batch:
            return 0
        
        # Query per controllare l'ultimo prezzo esistente per ogni farmaco
        check_last_price_query = text("""
            SELECT "drugId", "ssnReferencePrice", "publicPrice", date
            FROM price_history 
            WHERE "drugId" = :drug_id 
            ORDER BY date DESC 
            LIMIT 1
        """)
        
        # Query per inserire solo se i prezzi sono cambiati
        insert_price_query = text("""
            INSERT INTO price_history ("drugId", date, "ssnReferencePrice", "publicPrice")
            VALUES (:drug_id, :date, :ssn_reference_price, :public_price)
        """)
        
        prices_inserted = 0
        prices_unchanged = 0
        
        for price_data in prices_batch:
            try:
                # Controlla l'ultimo prezzo esistente per questo farmaco
                result = await session.execute(
                    check_last_price_query, 
                    {"drug_id": price_data['drug_id']}
                )
                last_price = result.fetchone()
                
                # Se non esiste un record precedente, inserisci sempre
                if not last_price:
                    await session.execute(insert_price_query, price_data)
                    prices_inserted += 1
                    continue
                
                # Confronta i prezzi con l'ultimo record esistente
                last_ssn_price = last_price[1]  # ssnReferencePrice
                last_public_price = last_price[2]  # publicPrice
                
                current_ssn_price = price_data['ssn_reference_price']
                current_public_price = price_data['public_price']
                
                # Controlla se i prezzi sono cambiati (considerando anche i valori NULL)
                ssn_changed = (
                    (last_ssn_price is None and current_ssn_price is not None) or
                    (last_ssn_price is not None and current_ssn_price is None) or
                    (last_ssn_price is not None and current_ssn_price is not None and 
                     abs(last_ssn_price - current_ssn_price) > 0.001)  # Tolleranza per float
                )
                
                public_changed = (
                    (last_public_price is None and current_public_price is not None) or
                    (last_public_price is not None and current_public_price is None) or
                    (last_public_price is not None and current_public_price is not None and 
                     abs(last_public_price - current_public_price) > 0.001)  # Tolleranza per float
                )
                
                # Inserisci solo se almeno un prezzo è cambiato
                if ssn_changed or public_changed:
                    await session.execute(insert_price_query, price_data)
                    prices_inserted += 1
                else:
                    prices_unchanged += 1
                    
            except Exception as e:
                logger.error(f"Errore nel processamento prezzo per farmaco {price_data.get('drug_id', 'unknown')}: {e}")
                continue
        
        if prices_unchanged > 0:
            logger.info(f"Saltati {prices_unchanged} prezzi invariati")
        
        return prices_inserted
    
    async def process_data(self, rows: List[Dict[str, str]]) -> None:
        """Processa e inserisce i dati nel database"""
        logger.info(f"Processando {len(rows)} righe di dati...")
        
        async with AsyncSession(self.engine) as session:
            drugs_inserted = 0
            prices_inserted = 0
            total_prices_processed = 0
            
            # Processa in batch
            for i in range(0, len(rows), BATCH_SIZE):
                batch_rows = rows[i:i + BATCH_SIZE]
                
                # Prepara batch farmaci
                drugs_batch = []
                prices_batch = []
                
                for row in batch_rows:
                    drug_data = {
                        'id': row['aic'],
                        'active_substance': row['principio_attivo'],
                        'brand_name': row['nome_commerciale'],
                        'pack': row['confezione'],
                        'holder': row.get('titolare_aic'),
                        'reference_package': row.get('confezione_di_riferimento'),
                        'atc': row.get('atc'),
                        'ssn_reference_price': row.get('prezzo_riferimento_ssn'),
                        'public_price': row.get('prezzo_pubblico'),
                        'price_difference': row.get('differenza'),
                        'note': row.get('nota'),
                        'equivalence_group_code': row.get('codice_gruppo_equivalenza')
                    }
                    drugs_batch.append(drug_data)
                    
                    # Aggiungi cronologia prezzi se disponibile
                    if row.get('prezzo_riferimento_ssn') is not None or row.get('prezzo_pubblico') is not None:
                        price_data = {
                            'drug_id': row['aic'],
                            'date': row['data_decorrenza'],
                            'ssn_reference_price': row.get('prezzo_riferimento_ssn'),
                            'public_price': row.get('prezzo_pubblico')
                        }
                        prices_batch.append(price_data)
                        total_prices_processed += 1
                
                # Inserisci batch
                try:
                    drugs_count = await self.upsert_drugs_batch(session, drugs_batch)
                    prices_count = await self.upsert_prices_batch(session, prices_batch)
                    
                    await session.commit()
                    
                    drugs_inserted += drugs_count
                    prices_inserted += prices_count
                    
                    logger.info(f"Batch {i//BATCH_SIZE + 1}: {drugs_count} farmaci, {prices_count} prezzi cambiati")
                    
                except Exception as e:
                    await session.rollback()
                    logger.error(f"Errore nel batch {i//BATCH_SIZE + 1}: {e}")
                    raise
            
            # Statistiche finali
            prices_unchanged = total_prices_processed - prices_inserted
            logger.info(f"=== Statistiche Finali ===")
            logger.info(f"Farmaci processati: {drugs_inserted}")
            logger.info(f"Prezzi totali processati: {total_prices_processed}")
            logger.info(f"Prezzi cambiati e inseriti/aggiornati: {prices_inserted}")
            logger.info(f"Prezzi invariati (saltati): {prices_unchanged}")
            if total_prices_processed > 0:
                change_percentage = (prices_inserted / total_prices_processed) * 100
                logger.info(f"Percentuale prezzi cambiati: {change_percentage:.1f}%")
    
    async def check_historical_data_exists(self) -> bool:
        """Controlla se esistono già dati storici dei prezzi nel database"""
        try:
            async with AsyncSession(self.engine) as session:
                # Controlla se esistono almeno 100 records di PriceHistory
                # (soglia minima per considerare che ci siano dati storici)
                result = await session.execute(
                    text("SELECT COUNT(*) FROM \"PriceHistory\" WHERE date < CURRENT_DATE - INTERVAL '30 days'")
                )
                count = result.scalar()
                logger.info(f"Trovati {count} record di prezzi storici (>30 giorni fa)")
                return count > 100
        except Exception as e:
            logger.error(f"Errore controllo dati storici: {e}")
            return False

    async def bootstrap_check_and_import(self) -> None:
        """Bootstrap: controlla se esistono dati storici e li importa se mancanti"""
        try:
            logger.info("=== Bootstrap: Controllo dati storici ===")
            
            # Controlla se esistono già dati storici
            has_historical_data = await self.check_historical_data_exists()
            
            if has_historical_data:
                logger.info("✅ Dati storici già presenti nel database")
                return
            
            logger.info("❌ Dati storici mancanti, avvio import automatico...")
            
            # Importa gli ultimi 12 mesi di dati storici
            from datetime import date, timedelta
            start_date = (date.today() - timedelta(days=365)).strftime('%Y-%m-%d')
            
            logger.info(f"Avvio import storico automatico dalla data: {start_date}")
            await self.run_historical_import(start_date)
            
            logger.info("✅ Bootstrap completato con successo")
            
        except Exception as e:
            logger.error(f"❌ Errore durante bootstrap: {e}")
            logger.error(traceback.format_exc())
            # Non fermare il worker per errori di bootstrap
            # continua con il normale funzionamento

    async def run_historical_import(self, start_from_date: Optional[str] = None) -> None:
        """Esegue l'import di tutti i file storici disponibili
        
        Args:
            start_from_date: Data in formato YYYY-MM-DD da cui iniziare l'import (opzionale)
        """
        try:
            logger.info("=== Inizio import storico AIFA ===")
            
            # Trova tutti i file storici
            historical_urls = await self.find_all_historical_files()
            
            if not historical_urls:
                logger.warning("Nessun file storico trovato")
                return
            
            # Filtra per data se specificata
            if start_from_date:
                import re
                from datetime import datetime
                start_date = datetime.strptime(start_from_date, '%Y-%m-%d')
                filtered_urls = []
                
                for url in historical_urls:
                    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
                    if date_match:
                        file_date = datetime.strptime(date_match.group(1), '%Y-%m-%d')
                        if file_date >= start_date:
                            filtered_urls.append(url)
                
                historical_urls = filtered_urls
                logger.info(f"Filtrati {len(historical_urls)} file dalla data {start_from_date}")
            
            if not historical_urls:
                logger.warning(f"Nessun file storico trovato dalla data {start_from_date}")
                return
            
            logger.info(f"Processando {len(historical_urls)} file storici...")
            
            total_processed = 0
            total_drugs = 0
            total_prices = 0
            failed_files = []
            
            for i, url in enumerate(historical_urls, 1):
                try:
                    import re
                    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
                    date_str = date_match.group(1) if date_match else "sconosciuta"
                    
                    logger.info(f"[{i}/{len(historical_urls)}] Processando file del {date_str}")
                    logger.info(f"URL: {url}")
                    
                    # Download e estrazione
                    rows = await self.download_and_extract_csv(url)
                    
                    # Normalizzazione colonne
                    rows = self.normalize_column_names(rows)
                    
                    # Estrai data dal nome del file
                    file_date = self.extract_date_from_url(url)
                    if file_date:
                        logger.info(f"Usando data dal file: {file_date}")
                    else:
                        logger.warning(f"Impossibile estrarre data da URL: {url}")
                    
                    # Pulizia e validazione
                    rows = self.clean_and_validate_data(rows, file_date)
                    
                    if len(rows) == 0:
                        logger.warning(f"Nessun dato valido trovato nel file del {date_str}")
                        continue
                    
                    # Conta farmaci e prezzi prima del processamento
                    drugs_count = len(rows)
                    prices_count = len([r for r in rows if r.get('prezzo_riferimento_ssn') is not None or r.get('prezzo_pubblico') is not None])
                    
                    # Processamento e inserimento
                    await self.process_data(rows)
                    
                    total_processed += 1
                    total_drugs += drugs_count
                    total_prices += prices_count
                    
                    logger.info(f"[{i}/{len(historical_urls)}] ✅ Completato file del {date_str}: {drugs_count} farmaci, {prices_count} prezzi")
                    
                except Exception as e:
                    logger.error(f"❌ Errore nel processamento del file del {date_str}: {e}")
                    failed_files.append((date_str, url, str(e)))
                    # Continua con il prossimo file
                    continue
            
            logger.info(f"=== Import storico completato ===")
            logger.info(f"File processati con successo: {total_processed}/{len(historical_urls)}")
            logger.info(f"File falliti: {len(failed_files)}")
            logger.info(f"Totale farmaci processati: {total_drugs}")
            logger.info(f"Totale prezzi processati: {total_prices}")
            
            if failed_files:
                logger.warning("File che hanno generato errori:")
                for date_str, url, error in failed_files[:5]:  # Mostra solo i primi 5
                    logger.warning(f"  - {date_str}: {error}")
                if len(failed_files) > 5:
                    logger.warning(f"  ... e altri {len(failed_files) - 5} file")
            
        except Exception as e:
            logger.error(f"Errore durante l'import storico: {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            await self.engine.dispose()

    async def run(self) -> None:
        """Esegue il processo ETL completo"""
        try:
            logger.info("=== Inizio processo ETL AIFA ===")
            
            # Trova l'ultimo file disponibile
            if AIFA_CSV_URL:
                # URL esplicito fornito tramite env
                latest_url = AIFA_CSV_URL
                logger.info(f"Usando URL configurato: {latest_url}")
            else:
                # Auto-discovery dell'ultimo file
                logger.info("Auto-discovery dell'ultimo file AIFA...")
                latest_url = await self.find_latest_aifa_file()
            
            # Download e estrazione
            rows = await self.download_and_extract_csv(latest_url)
            
            # Normalizzazione colonne
            rows = self.normalize_column_names(rows)
            
            # Estrai data dal nome del file
            file_date = self.extract_date_from_url(latest_url)
            if file_date:
                logger.info(f"Usando data dal file: {file_date}")
            else:
                logger.warning(f"Impossibile estrarre data da URL: {latest_url}")
            
            # Pulizia e validazione
            rows = self.clean_and_validate_data(rows, file_date)
            
            if len(rows) == 0:
                logger.warning("Nessun dato valido trovato dopo la pulizia")
                return
            
            # Processamento e inserimento
            await self.process_data(rows)
            
            logger.info("=== Processo ETL completato con successo ===")
            
        except Exception as e:
            logger.error(f"Errore durante il processo ETL: {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            await self.engine.dispose()

def test_csv_processing():
    """Test della logica di processamento CSV"""
    processor = AIFAProcessor()
    # Leggi il file CSV test con tutte le colonne
    test_csv_data = [
        {
            'Principio attivo': 'PARACETAMOLO',
            'Confezione di riferimento': '20 CPR 500MG',
            'ATC': 'N02BE01',
            'AIC': '123456789',
            'Farmaco': 'TACHIPIRINA',
            'Confezione': '20 CPR 500MG',
            'Ditta': 'ANGELINI PHARMA SPA',
            'Prezzo riferimento SSN': '3.50',
            'Prezzo Pubblico 14 aprile 2025': '4.20',
            'Differenza': '0.70',
            'Nota': 'Classe A',
            'Codice gruppo equivalenza': 'EQ001'
        },
        {
            'Principio attivo': 'IBUPROFENE',
            'Confezione di riferimento': '12 CPR 200MG',
            'ATC': 'M01AE01',
            'AIC': '987654321',
            'Farmaco': 'MOMENT',
            'Confezione': '12 CPR 200MG',
            'Ditta': 'BAYER SPA',
            'Prezzo riferimento SSN': '5.20',
            'Prezzo Pubblico 14 aprile 2025': '6.80',
            'Differenza': '1.60',
            'Nota': 'Classe A',
            'Codice gruppo equivalenza': 'EQ002'
        },
    ]
    
    print("Test con dati CSV di esempio...")
    rows = processor.normalize_column_names(test_csv_data)
    print(f"Righe normalizzate: {len(rows)}")
    for i, row in enumerate(rows[:2]):
        print(f"Riga {i}: {row}")
    
    cleaned_rows = processor.clean_and_validate_data(rows)
    print(f"Righe pulite: {len(cleaned_rows)}")
    for i, row in enumerate(cleaned_rows[:2]):
        print(f"Riga pulita {i}: {row}")

def print_help():
    """Stampa l'aiuto per l'utilizzo del worker"""
    print("""
FarMix Worker - ETL per Liste di Trasparenza AIFA

UTILIZZO:
  python main.py [COMANDO] [OPZIONI]

COMANDI:
  (nessuno)             Esegue ETL normale con l'ultimo file disponibile
  --test-connection     Testa la connessione al database
  --test-csv           Testa l'elaborazione CSV con dati di esempio
  --list-historical    Lista tutti i file storici disponibili su AIFA
  --import-historical [DATA]  Importa tutti i file storici
                              DATA (opzionale): inizio import in formato YYYY-MM-DD
  --bootstrap          Controlla e importa dati storici se mancanti
  --help               Mostra questo messaggio di aiuto

ESEMPI:
  python main.py                           # ETL normale
  python main.py --import-historical       # Importa tutto lo storico
  python main.py --import-historical 2024-01-01  # Importa dal 1 gennaio 2024
  python main.py --list-historical         # Lista file disponibili
  python main.py --bootstrap               # Controlla e importa dati se mancanti

VARIABILI AMBIENTE:
  DATABASE_URL         URL connessione PostgreSQL (richiesta)
  AIFA_CSV_URL        URL specifico da usare (opzionale)
  REQUEST_TIMEOUT     Timeout richieste in secondi (default: 120)
  BATCH_SIZE          Dimensione batch per DB (default: 1000)
""")

async def main():
    """Funzione principale"""
    if len(sys.argv) > 1 and sys.argv[1] in ["--help", "-h"]:
        print_help()
        return
    
    # Setup logging solo per comandi che ne hanno bisogno
    global logger
    logger = setup_logging()
    
    # Verifica configurazione
    if not DATABASE_URL:
        logger.error("DATABASE_URL non configurata nelle variabili ambiente")
        sys.exit(1)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--test-connection":
        # Test connessione database
        try:
            engine = create_async_engine(DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"))
            async with AsyncSession(engine) as session:
                result = await session.execute(text("SELECT 1"))
                print("✅ Connessione database OK")
                await engine.dispose()
                return
        except Exception as e:
            print(f"❌ Errore connessione database: {e}")
            sys.exit(1)
    
    elif len(sys.argv) > 1 and sys.argv[1] == "--test-csv":
        # Test con file CSV locale
        test_csv_processing()
        return
    
    elif len(sys.argv) > 1 and sys.argv[1] == "--import-historical":
        # Import di tutti i file storici
        start_date = None
        if len(sys.argv) > 2:
            start_date = sys.argv[2]
            try:
                from datetime import datetime
                datetime.strptime(start_date, '%Y-%m-%d')  # Valida il formato
            except ValueError:
                print(f"❌ Formato data non valido: {start_date}. Usa YYYY-MM-DD")
                sys.exit(1)
        
        processor = AIFAProcessor()
        await processor.run_historical_import(start_date)
        return
    
    elif len(sys.argv) > 1 and sys.argv[1] == "--bootstrap":
        # Bootstrap: controlla e importa dati storici se mancanti
        processor = AIFAProcessor()
        await processor.bootstrap_check_and_import()
        return
    
    elif len(sys.argv) > 1 and sys.argv[1] == "--list-historical":
        # Lista tutti i file storici disponibili (senza importarli)
        processor = AIFAProcessor()
        try:
            logger.info("Ricerca file storici disponibili...")
            historical_urls = await processor.find_all_historical_files()
            
            if not historical_urls:
                print("❌ Nessun file storico trovato")
                return
            
            print(f"📁 Trovati {len(historical_urls)} file storici:")
            for i, url in enumerate(historical_urls, 1):
                import re
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', url)
                date_str = date_match.group(1) if date_match else "Data sconosciuta"
                print(f"  {i:2d}. {date_str} - {url}")
                
        except Exception as e:
            print(f"❌ Errore nella ricerca file storici: {e}")
            sys.exit(1)
        finally:
            await processor.engine.dispose()
        return
    
    # Esegui ETL normale (ultimo file)
    processor = AIFAProcessor()
    await processor.run()

if __name__ == "__main__":
    asyncio.run(main())