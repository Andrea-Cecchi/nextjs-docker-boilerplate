# FarMix Worker

Worker Python per l'importazione automatica dei dati delle Liste di Trasparenza AIFA.

## Funzionalità

- **ETL Automatico**: Scarica e processa automaticamente l'ultimo file AIFA disponibile
- **Import Storico**: Importa tutti i file storici disponibili dal sito AIFA
- **Bootstrap Automatico**: Controlla e importa dati storici automaticamente all'avvio se mancanti
- **Auto-discovery**: Trova automaticamente i file più recenti senza configurazione manuale
- **Gestione Errori**: Robusto handling degli errori con logging dettagliato
- **Batch Processing**: Elaborazione efficiente in batch per grandi dataset
- **Controllo Prezzi Cambiati**: Inserisce record nella tabella `price_history` solo quando i prezzi sono effettivamente cambiati, evitando duplicati e record inutili

## Utilizzo

### Docker (Raccomandato)

```bash
# ETL normale (ultimo file)
docker compose run --rm farmix-worker

# Lista file storici disponibili
docker compose run --rm farmix-worker python main.py --list-historical

# Importa tutto lo storico
docker compose run --rm farmix-worker python main.py --import-historical

# Importa da una data specifica
docker compose run --rm farmix-worker python main.py --import-historical 2024-01-01

# Test connessione database
docker compose run --rm farmix-worker python main.py --test-connection

# Test elaborazione CSV
docker compose run --rm farmix-worker python main.py --test-csv

# Test logica prezzi cambiati
docker compose run --rm farmix-worker python test_price_changes.py

# Bootstrap: controlla e importa dati storici se mancanti
docker compose run --rm farmix-worker python main.py --bootstrap
```

### Locale

```bash
# Configura l'ambiente
pip install -r requirements.txt

# ETL normale
python main.py

# Import storico completo
python main.py --import-historical

# Import da data specifica
python main.py --import-historical 2023-01-01

# Lista file disponibili
python main.py --list-historical

# Test connessione
python main.py --test-connection

# Test elaborazione CSV
python main.py --test-csv

# Test logica prezzi cambiati
python test_price_changes.py

# Bootstrap automatico
python main.py --bootstrap

# Aiuto
python main.py --help
```

## Variabili Ambiente

| Variabile         | Descrizione                             | Default | Richiesta |
| ----------------- | --------------------------------------- | ------- | --------- |
| `DATABASE_URL`    | URL PostgreSQL                          | -       | ✅        |
| `AIFA_CSV_URL`    | URL specifico (override auto-discovery) | -       | ❌        |
| `REQUEST_TIMEOUT` | Timeout richieste HTTP (secondi)        | 120     | ❌        |
| `BATCH_SIZE`      | Dimensione batch per inserimenti DB     | 1000    | ❌        |

## Funzionalità Avanzate

### Auto-discovery AIFA

Il worker è in grado di trovare automaticamente i file più recenti senza configurazione:

1. **CSV Corrente**: Cerca il file CSV non-ZIP più recente
2. **ZIP Storici**: Trova file ZIP con pattern data nel nome
3. **Fallback**: Usa URL di fallback se non trova nulla

### Import Storico

La funzione `--import-historical` permette di:

- Scaricare **tutti** i file storici disponibili su AIFA
- Filtrare per data di inizio (utile per recovery)
- Processare in sequenza con gestione errori robusta
- Fornire statistiche dettagliate di import

### Bootstrap Automatico

La funzione `--bootstrap` (eseguita automaticamente all'avvio):

- Controlla se esistono almeno 100 record di prezzo storico (>30 giorni fa)
- Se mancanti, avvia automaticamente l'import storico degli ultimi 12 mesi
- Garantisce che il database sia sempre popolato con dati storici
- Esegue solo se necessario, non sovrascrive dati esistenti

### Gestione Errori

- **Retry automatico**: su errori di rete temporanei
- **Skip file corrotti**: continua con il prossimo file
- **Logging dettagliato**: per debugging e monitoring
- **Transazioni DB**: rollback automatico su errori

### Controllo Prezzi Cambiati

Il worker ora include una logica intelligente per evitare l'inserimento di record duplicati o inutili nella tabella `price_history`:

1. **Controllo Ultimo Prezzo**: Verifica l'ultimo prezzo esistente per ogni farmaco
2. **Confronto Prezzi**: Confronta i prezzi attuali con l'ultimo record esistente
3. **Tolleranza Float**: Usa una tolleranza di 0.001 per confronti tra valori float
4. **Gestione NULL**: Gestisce correttamente i valori NULL nei prezzi
5. **Statistiche Dettagliate**: Fornisce statistiche su prezzi cambiati vs invariati

**Comportamento**:

- Se non esiste un record precedente → Inserisce sempre
- Se esiste un record precedente → Confronta prezzi con l'ultimo record
- Se prezzi identici → Salta l'inserimento
- Se prezzi diversi → Inserisce nuovo record

**Benefici**:

- Riduce significativamente il numero di record duplicati
- Migliora le performance del database
- Fornisce cronologia prezzi più pulita e accurata
- Evita record con data di oggi ma senza cambiamenti reali

## Architettura

```
┌─────────────────┐
│   AIFA Website  │  https://www.aifa.gov.it/storico-liste-di-trasparenza
└─────────┬───────┘
          │ HTTP Download
          ▼
┌─────────────────┐
│ FarMix Worker   │  Parsing, Validation, Normalization
└─────────┬───────┘
          │ SQL Insert/Update
          ▼
┌─────────────────┐
│  PostgreSQL DB  │  drug + price_history tables
└─────────────────┘
```

## Monitoraggio

### Logs

I log sono salvati in:

- **Docker**: `/tmp/farmix-worker.log` dentro il container
- **Locale**: `/tmp/farmix-worker.log`

### Health Check

Il worker include un health check integrato:

```bash
python main.py --test-connection
```

### Metriche Tipiche

Un import storico completo tipicamente processa:

- **~50-100 file storici** (dipende dalla disponibilità AIFA)
- **~20.000-40.000 farmaci unici**
- **~100.000-500.000 record di prezzo**
- **Tempo**: 30-60 minuti (dipende dalla connessione)

### Monitoraggio Risultati

Dopo l'esecuzione del worker, puoi verificare l'efficacia del controllo prezzi:

```sql
-- Controlla record duplicati per la stessa data
SELECT "drugId", date, COUNT(*) as count
FROM price_history
WHERE date = CURRENT_DATE
GROUP BY "drugId", date
HAVING COUNT(*) > 1;

-- Controlla record con prezzi identici consecutivi
WITH price_changes AS (
  SELECT
    "drugId",
    date,
    "ssnReferencePrice",
    "publicPrice",
    LAG("ssnReferencePrice") OVER (PARTITION BY "drugId" ORDER BY date) as prev_ssn,
    LAG("publicPrice") OVER (PARTITION BY "drugId" ORDER BY date) as prev_public
  FROM price_history
  WHERE "drugId" IN (SELECT "drugId" FROM price_history WHERE date = CURRENT_DATE)
)
SELECT COUNT(*) as unchanged_prices
FROM price_changes
WHERE "ssnReferencePrice" = prev_ssn AND "publicPrice" = prev_public;

-- Statistiche generali
SELECT
  COUNT(*) as total_records,
  COUNT(DISTINCT "drugId") as unique_drugs,
  COUNT(DISTINCT date) as unique_dates
FROM price_history
WHERE date = CURRENT_DATE;
```

## Troubleshooting

### Errori Comuni

1. **Connection Error**: Verifica `DATABASE_URL` e che PostgreSQL sia avviato
2. **Download Timeout**: Aumenta `REQUEST_TIMEOUT` se la connessione è lenta
3. **Memory Error**: Riduci `BATCH_SIZE` se hai poca RAM disponibile
4. **File Non Trovato**: AIFA potrebbe aver cambiato il formato URL

### Debug

```bash
# Verifica file disponibili
python main.py --list-historical

# Test con dati di esempio
python main.py --test-csv

# Test connessione DB
python main.py --test-connection
```

## Scheduling

### Cron (Produzione)

```bash
# Aggiungi a crontab per eseguire ogni giorno alle 4:00
0 4 * * * cd /path/to/farmix && docker compose run --rm farmix-worker
```

### Systemd Timer

```ini
# /etc/systemd/system/farmix-etl.timer
[Unit]
Description=FarMix ETL Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## Contribuire

1. Fork del repository
2. Crea feature branch
3. Aggiungi test per nuove funzionalità
4. Submit pull request

## License

MIT License - vedi LICENSE file.
