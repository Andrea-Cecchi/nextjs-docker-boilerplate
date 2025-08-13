#!/bin/bash

echo "Avvio FarMix Worker..."

echo "Test connessione database..."
/usr/local/bin/python main.py --test-connection

if [ $? -eq 0 ]; then
  echo "Database OK, import storico completo..."
  /usr/local/bin/python main.py --import-historical
  
  echo "Import storico completato, avvio cron..."
  service cron start
  tail -f /var/log/cron.log
else
  echo "Errore database, uscita"
  exit 1
fi