# Next.js Docker Boilerplate

Un boilerplate **moderno e minimale** basato su **Next.js 15** con **Docker** e **PostgreSQL** pronto all'uso. 
Integra **Tailwind CSS + shadcn/ui**, **Prisma ORM** e **Better Auth** per fornire autenticazione, database e UI out-of-the-box.

> Ideale per iniziare rapidamente nuovi progetti React/TypeScript senza perdere tempo in configurazioni.

---

## ✨ Tech Stack

| Tecnologia | Versione | Ruolo |
| ---------- | -------- | ----- |
| Next.js | 15.x | Framework React (App Router) |
| React | 19.x | Libreria UI |
| PostgreSQL | 15 | Database relazionale |
| Prisma | 6.x | ORM type-safe + migrazioni |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | latest | Component library (Radix UI) |
| Better Auth | latest | Autenticazione credentials/OAuth |
| Docker & Compose | 24+ | Contenitori dev/prod |

---

## 🚀 Quick Start con Docker

Prerequisiti: **Docker** (Desktop o Engine) e **Docker Compose**.

```bash
# 1. Clona il repository
$ git clone https://github.com/Andrea-Cecchi/nextjs-docker-boilerplate.git
$ cd nextjs-docker-boilerplate

# 2. Copia le variabili d'ambiente
$ cp .env.example .env
# → modifica DATABASE_URL, JWT_SECRET, ecc.

# 3. Avvia lo stack in modalità sviluppo
$ docker compose up --build

# 4. Apri il browser
http://localhost:3000
```

Container avviati:

| Nome | Porta | Descrizione |
| ---- | ----- | ----------- |
| **app** | 3000 | Next.js con Hot Reload |
| **db** | 5432 | PostgreSQL 15 con volume persistente |
| **prisma-studio** | 5555 | Browser DB (Prisma Studio) |

> Prisma Studio è accessibile su `http://localhost:5555` quando i container sono attivi.

---

## 🧑‍💻 Workflow locale (senza Docker)

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo (Turbopack)
npm run dev

# (Opzionale) Esegui le migrazioni e genera il client Prisma
npm run db:generate
```

Script utili (`package.json`):

| Comando | Descrizione |
| ------- | ----------- |
| `npm run dev` | Avvia Next.js in *development* |
| `npm run build` | Build di produzione |
| `npm start` | Avvia la build nel container/app locale |
| `npm run lint` | Esegue ESLint |
| `npm run format:write` | Format del codice con Prettier |
| `npm run db:generate` | `prisma migrate dev` (crea/aggiorna schema) |
| `npm run db:migrate` | `prisma migrate deploy` (production) |
| `npm run db:studio` | Apre Prisma Studio |

---

## 🗄️ Database & Prisma

La connessione al DB è definita in **`DATABASE_URL`** (`.env`). Il file **`prisma/schema.prisma`** è configurato per **PostgreSQL**.

Esempio di creazione migrazione in sviluppo:

```bash
# Modifica schema.prisma poi:
npm run db:generate -- --name add_profile_table
```

In produzione (container `app`) la command `start:migrate:prod` applica automaticamente le migrazioni prima di avviare l'app.

---

## 🔐 Better Auth

Il boilerplate include un setup base con:

- **Credentials Provider** (email + password)
- Gestione sessioni JWT
- Hook React (`useAuth`) per accedere a utente/stato

Per aggiungere OAuth (Google, GitHub, ecc.):
1. Crea le API key sul provider.
2. Inserisci i valori nel `.env`.
3. Estendi `src/lib/auth.ts` con il nuovo provider.

Route di esempio protetta: `src/app/dashboard`.

---

## 📂 Struttura progetto

```
├─ src/
│  ├─ app/              # App Router (routes & layouts)
│  │   └─ api/          # Route handlers (API)
│  ├─ components/       # Componenti riutilizzabili + shadcn/ui
│  ├─ lib/              # Funzioni lato client & server (auth, utils)
│  ├─ server/           # Configurazioni server-side (DB)
│  └─ styles/           # Tailwind CSS & globali
├─ prisma/              # Schema e migrazioni Prisma
├─ docker-compose.yaml  # Stack di sviluppo
├─ docker-compose-prod.yaml # Stack produzione
└─ Dockerfile(.prod)    # Build container
```

---

## 🏗️ Deploy

### Docker Compose (produzione)

Per un deploy semplice su VPS/bare-metal, usa **`docker-compose-prod.yaml`**:

```bash
# 1. Copia/aggiorna variabili d'ambiente (usate solo a runtime)
cp .env.example .env    # personalizza valori

# 2. Avvia in background i container ottimizzati per la produzione
docker compose -f docker-compose-prod.yaml --env-file .env up --build -d

# 3. Controlla i log o lo stato dei container
docker compose -f docker-compose-prod.yaml ps
```

I servizi definiti nel file includono:

| Servizio | Porta | Descrizione |
| -------- | ----- | ----------- |
| **app** | 3000 | Next.js in modalità `start` (build ottimizzata) |
| **db** | 5432 | PostgreSQL 15 con volume persistente |

> Puoi personalizzare il file `docker-compose-prod.yaml` per aggiungere reverse proxy (NGINX, Traefik) o servizi aggiuntivi.

### Altri provider (Vercel / Netlify / Fly.io)

Il progetto resta compatibile con il deployment serverless/edge di Next.js. Aggiungi `DATABASE_URL` come variabile ambiente e usa i rispettivi workflow CI.

---

## 🤝 Contributi

1. Fork del repo
2. Crea un branch: `git checkout -b feat/nuova-feature`
3. Commit & push: `git commit -m "feat: implementa nuova feature" && git push origin feat/nuova-feature`
4. Apri una Pull Request 🎉

---

## 📝 Licenza

Distribuito sotto licenza **MIT**. Vedi `LICENSE` per dettagli.
