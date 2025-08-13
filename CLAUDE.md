# Farmix – Specifiche di Progetto

> Questa guida step-by-step serve a **Claude** per generare (o evolvere) il nuovo progetto _Farmix_ partendo dal boilerplate presente nella cartella.  
> Manteniamo la stessa _tech-stack_ (Next 14 + App Router, TypeScript, Prisma, Tailwind + shadcn/ui, AuthJS) e aggiungiamo le funzionalità descritte.

---

## 1. Contesto e Obiettivi

1. Scaricare periodicamente gli archivi **ZIP** rilasciati da **AIFA – Liste di Trasparenza** che contengono un **CSV** con la lista dei farmaci rimborsati (classe A) e relativi prezzi di riferimento.
2. Persistere i dati in PostgreSQL via **Prisma**.
3. Offrire all'utente autenticato:
   - Ricerca e filtro avanzato dei farmaci.
   - Dettaglio di un farmaco con **grafico** dell'andamento storico del prezzo.
   - Possibilità di aggiungere/rimuovere farmaci tra i _preferiti_.
4. Interfaccia moderna, minimale, con tocchi "PA italiana" (palette blu-istituzionale, testo chiaro, font "Titillium Web" o "Source Sans 3").

## 2. Sorgente Dati AIFA

- Pagina di riferimento: https://www.aifa.gov.it/liste-di-trasparenza (vedi sezione "List in .csv format").
- Nome file tipico: `list_transparency_<YYYYMMDD>.csv` (zippato).
- Frequenza indicativa: 2-3 volte al mese → pianifichiamo un _cron_ giornaliero h 04:00.
- Campi principali (verificare dal CSV reale):
  | Colonna CSV | Tipo | Descrizione |
  |-------------|------|-------------|
  | `AIC` | string | Codice autorizzazione |
  | `PrincipioAttivo` | string | Molecola |
  | `NomeCommerciale` | string | Brand |
  | `Confezione` | string | Formato + dosaggio |
  | `PrezzoRimborso` | decimal | Prezzo di riferimento |
  | `DataDecorrenza` | date | Data validità prezzo |

## 3. Modello Dati (Prisma)

```prisma
model Drug {
  id              String   @id(map: "aic") @db.VarChar(9)
  activeSubstance String
  brandName       String
  pack            String
  holder          String?
  priceHistory    PriceHistory[]
}

model PriceHistory {
  id        Int      @id @default(autoincrement())
  drugId    String   @db.VarChar(9)
  date      DateTime @db.Date
  price     Decimal  @db.Decimal(10,3)
  Drug      Drug     @relation(fields: [drugId], references: [id])

  @@unique([drugId, date])
}

model Favorite {
  id     Int    @id @default(autoincrement())
  userId String @db.VarChar(36)
  drugId String @db.VarChar(9)

  user   User   @relation(fields: [userId], references: [id])
  drug   Drug   @relation(fields: [drugId], references: [id])

  @@unique([userId, drugId])
}
```

> Riferimento Prisma: vedi `model` & `@@unique` su Context7 → `/prisma/docs`.

Dopo aver aggiunto i modelli:

```bash
npx prisma migrate dev --name drug_models
```

## 4. ETL – Servizio Worker Separato

> Tutta la logica di **download degli ZIP**, estrazione del CSV ed **ingestione** nel DB viene delegata a un **container dedicato** `farmix-worker`. Così l'app Next/Prisma resta leggera mentre il worker può usare la tecnologia più efficiente (Python + pandas & SQLAlchemy).

**Stack worker consigliato:**

- Python 3.12 alpine
- Librerie: `requests`, `pandas`, `zipfile`, `python-dotenv`, `sqlalchemy[asyncio]`, `asyncpg`.

### Flusso del worker

1. **Scheduler**: usa `cron` di sistema (crontab `0 4 * * *`) oppure `apscheduler` se si preferisce run continuo.
2. **Passi ETL**:

   ```python
   import pandas as pd, requests, zipfile, io, os
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

   AIFA_URL = os.getenv("AIFA_CSV_URL")  # es: https://…/list-in-csv.zip
   engine = create_async_engine(os.getenv("DATABASE_URL"), echo=False)

   async def process():
       resp = requests.get(AIFA_URL, timeout=60)
       with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
           csv_name = [n for n in z.namelist() if n.endswith('.csv')][0]
           df = pd.read_csv(z.open(csv_name), sep=';', dtype=str)
       async with AsyncSession(engine) as session:
           for _, row in df.iterrows():
               # chiamata a stored procedure o upsert manuale
               await session.execute(
                   """
                   INSERT INTO "Drug" (id, activeSubstance, brandName, pack)
                   VALUES (:id, :act, :brand, :pack)
                   ON CONFLICT (id) DO UPDATE SET brandName = EXCLUDED.brandName;
                   """,
                   dict(id=row.AIC, act=row.PrincipioAttivo, brand=row.NomeCommerciale, pack=row.Confezione),
               )
               # inserisci storico prezzo similmente
           await session.commit()

   if __name__ == "__main__":
       import asyncio, sys
       asyncio.run(process())
   ```

3. **Trigger manuale**: `docker compose run --rm farmix-worker`.

### Artefatti

- `worker/` directory con `Dockerfile`, `requirements.txt`, `main.py`, `crontab`.

## 5. API / Server Actions

- `/api/drugs/search` → query param `q` + paginazione.
- `/api/drugs/[aic]` → detail + price history.
- `/api/favorites` (POST/DELETE) → gestione preferiti.

## 6. UI / Pagine

| Route                  | Componente       | Note                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| `/`                    | `home`           | Intro & search bar full-width                          |
| `/drugs`               | `DrugsPage`      | Lista con filtro testo, principio attivo, range prezzo |
| `/drugs/[aic]`         | `DrugDetailPage` | Card dettagli + **Grafico** (Recharts)                 |
| `/dashboard/favorites` | `FavoritesPage`  | Tabella farmaci preferiti per utente                   |

Componenti chiave (shadcn/ui): `DataTable`, `Card`, `Button`, `Input`, `Dialog`.

### Grafici

- Libreria consigliata: **Recharts** (molto leggera) → `<LineChart>` con date vs prezzo.

## 7. Stile

- Tailwind già configurato. Aggiungi in `tailwind.config.ts`:
  ```js
  fontFamily: {
    sans: ["'Titillium Web'", 'sans-serif'],
  }
  ```
- Palette di base:
  ```css
  --pa-blue: #0066cc;
  --pa-light-blue: #e5f1fb;
  --pa-gray: #f5f5f5;
  ```
- Navbar minimal con logo FarMix (testo + icona stilizzata pillola).

## 8. Sicurezza & Auth

- Il boilerplate usa **better-auth** (vedi `src/lib/auth.ts`, `auth-client.ts`, `middleware.ts`). Riutilizzare la stessa configurazione e assicurarsi che il modello `Favorite` sia collegato all'utente autenticato (`userId` → `session.user.id`).
- Proteggere tutte le rotte `/dashboard/**` con `middleware.ts` esistente.

## 9. DevOps

Nel `docker-compose.yaml`:

```yaml
services:
  web:
    build: .
    # … configurazione Next.js

  farmix-worker:
    build:
      context: ./worker
      dockerfile: Dockerfile
    env_file: .env
    restart: unless-stopped
    # esegue cron in foreground
    command: ["crond", "-f", "-l", "2"]
```

Cartella `worker/` esempio:

```text
worker/
  ├── Dockerfile
  ├── requirements.txt
  ├── main.py
  └── crontab
```

`Dockerfile` minimal:

```Dockerfile
FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py ./
COPY crontab /etc/crontabs/root
CMD ["crond", "-f", "-l", "2"]
```

Variabili `.env` richieste (condivise tra web & worker):

- `DATABASE_URL`
- `AIFA_CSV_URL` (override manuale per test)

## 10. To-do rapido

- [ ] Aggiornare `prisma/schema.prisma` + migrazione.
- [ ] Implementare job `update-drugs.ts` + CLI/cron.
- [ ] Creare API routes & server actions.
- [ ] Creare UI pages e componenti.
- [ ] Stesura README con istruzioni setup.

---

### Riferimenti Utili

- Prisma schema doc → Context7 ID `/prisma/docs`.
- Recharts usage → Context7 ID `/recharts/recharts` (ricerca eventuale).
- Node-Cron guida rapida.

_Buon lavoro!_
