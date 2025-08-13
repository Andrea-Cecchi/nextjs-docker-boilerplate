FROM python:3.12-slim

# Installa dipendenze di sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    curl \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Crea directory di lavoro
WORKDIR /app

# Copia e installa dipendenze Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia script principale e script di avvio
COPY main.py .
COPY start.sh .
COPY crontab /etc/cron.d/farmix-cron

# Rendi eseguibili gli script
RUN chmod +x main.py start.sh

# Configura cron
RUN chmod 0644 /etc/cron.d/farmix-cron && \
    crontab /etc/cron.d/farmix-cron && \
    touch /var/log/cron.log

# Esponi porta per health check
EXPOSE 8080

# Crea health check endpoint semplice
RUN echo '#!/bin/sh' > /app/health.sh && \
    echo 'echo "HTTP/1.1 200 OK"' >> /app/health.sh && \
    echo 'echo "Content-Type: text/plain"' >> /app/health.sh && \
    echo 'echo ""' >> /app/health.sh && \
    echo 'echo "FarMix Worker: OK"' >> /app/health.sh && \
    chmod +x /app/health.sh

# Comando di avvio
CMD ["./start.sh"]