#!/usr/bin/env python3
"""
Test per la logica di controllo dei prezzi cambiati
"""

import sys
import os
from datetime import date
sys.path.append('/app')

from main import AIFAProcessor, setup_logging

# Setup logging
logger = setup_logging()

def test_price_comparison():
    """Test della logica di confronto prezzi"""
    processor = AIFAProcessor()
    
    print("=== Test Logica Confronto Prezzi ===")
    
    # Test cases
    test_cases = [
        # (last_ssn, last_public, current_ssn, current_public, expected_changed)
        (None, None, None, None, False),  # Entrambi NULL
        (None, None, 10.0, None, True),   # SSN cambiato da NULL
        (10.0, None, None, None, True),   # SSN cambiato a NULL
        (10.0, 15.0, 10.0, 15.0, False), # Stessi prezzi
        (10.0, 15.0, 10.001, 15.0, False), # Differenza minima (entro tolleranza)
        (10.0, 15.0, 10.002, 15.0, True),  # Differenza oltre tolleranza
        (10.0, 15.0, 10.0, 15.002, True),  # Prezzo pubblico cambiato
        (10.0, None, 10.0, 20.0, True),    # Prezzo pubblico aggiunto
        (None, 15.0, 10.0, 15.0, True),    # Prezzo SSN aggiunto
    ]
    
    for i, (last_ssn, last_public, current_ssn, current_public, expected) in enumerate(test_cases):
        # Simula la logica di confronto
        ssn_changed = (
            (last_ssn is None and current_ssn is not None) or
            (last_ssn is not None and current_ssn is None) or
            (last_ssn is not None and current_ssn is not None and 
             abs(last_ssn - current_ssn) > 0.001)
        )
        
        public_changed = (
            (last_public is None and current_public is not None) or
            (last_public is not None and current_public is None) or
            (last_public is not None and current_public is not None and 
             abs(last_public - current_public) > 0.001)
        )
        
        actual = ssn_changed or public_changed
        status = "✅" if actual == expected else "❌"
        
        print(f"Test {i+1}: {status}")
        print(f"  Ultimo: SSN={last_ssn}, Public={last_public}")
        print(f"  Attuale: SSN={current_ssn}, Public={current_public}")
        print(f"  Cambiato: {actual} (atteso: {expected})")
        print()

def test_data_cleaning():
    """Test della pulizia dati con prezzi"""
    processor = AIFAProcessor()
    
    print("=== Test Pulizia Dati con Prezzi ===")
    
    # Dati di test con prezzi
    test_data = [
        {
            'aic': '123456789',
            'nome_commerciale': 'Farmaco Test 1',
            'principio_attivo': 'Principio Test',
            'confezione': '10 CPR 500MG',
            'prezzo_riferimento_ssn': '10.50',
            'prezzo_pubblico': '12.00',
            'data_decorrenza': date.today()
        },
        {
            'aic': '987654321',
            'nome_commerciale': 'Farmaco Test 2',
            'principio_attivo': 'Principio Test 2',
            'confezione': '20 CPR 200MG',
            'prezzo_riferimento_ssn': '15.75',
            'prezzo_pubblico': '18.50',
            'data_decorrenza': date.today()
        }
    ]
    
    # Test normalizzazione
    normalized = processor.normalize_column_names(test_data)
    print(f"Righe normalizzate: {len(normalized)}")
    
    # Test pulizia
    cleaned = processor.clean_and_validate_data(normalized)
    print(f"Righe pulite: {len(cleaned)}")
    
    for i, row in enumerate(cleaned):
        print(f"Riga {i+1}:")
        print(f"  AIC: {row.get('aic')}")
        print(f"  Nome: {row.get('nome_commerciale')}")
        print(f"  Prezzo SSN: {row.get('prezzo_riferimento_ssn')}")
        print(f"  Prezzo Pubblico: {row.get('prezzo_pubblico')}")
        print(f"  Data: {row.get('data_decorrenza')}")
        print()

if __name__ == "__main__":
    test_price_comparison()
    test_data_cleaning()
    print("=== Test Completati ===") 