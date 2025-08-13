#!/usr/bin/env python3
"""
Script per l'esecuzione manuale del worker FarMix
Utile per testing e debugging
"""

import asyncio
import sys
import os
from main import AIFAProcessor

async def run_manual():
    """Esegue il worker manualmente"""
    print("=== FarMix Worker - Esecuzione Manuale ===")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'NON CONFIGURATA')}")
    print(f"AIFA_CSV_URL: {os.getenv('AIFA_CSV_URL', 'DEFAULT')}")
    print()
    
    processor = AIFAProcessor()
    await processor.run()

if __name__ == "__main__":
    asyncio.run(run_manual())