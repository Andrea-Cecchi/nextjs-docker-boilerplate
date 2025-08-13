#!/usr/bin/env python3
"""Test column mapping"""

import sys
sys.path.append('/app')

from main import AIFAProcessor, setup_logging

# Setup logging
logger = setup_logging()

# Create processor
processor = AIFAProcessor()

# Test data with all columns
test_data = [
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
    }
]

print("=== Testing Column Mapping ===")
print("Original columns:", list(test_data[0].keys()))

# Normalize column names
normalized = processor.normalize_column_names(test_data)
print("Normalized columns:", list(normalized[0].keys()))

# Clean and validate
cleaned = processor.clean_and_validate_data(normalized)
print("Cleaned columns:", list(cleaned[0].keys()))

print("\n=== Sample Data ===")
sample = {k: v for k, v in cleaned[0].items() if k not in ['data_decorrenza']}
for k, v in sample.items():
    print(f"{k}: {v}")