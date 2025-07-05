# Guida alla Configurazione di Better Auth

## 🚀 Modifiche Implementate

### 1. **Configurazione Server-side** (`src/lib/auth.ts`)
- ✅ Aggiunto plugin `nextCookies` per migliorare la gestione dei cookie
- ✅ Configurato `useSecureCookies` basato su `NODE_ENV`
- ✅ Aggiunto supporto per `trustedOrigins`
- ✅ Configurato `requireEmailVerification` (disabilitato per default)

### 2. **Configurazione Client-side** (`src/lib/auth-client.ts`)
- ✅ Aggiunto `baseURL` per configurazione dinamica
- ✅ Utilizzato `better-auth/react` per funzionalità React ottimizzate

### 3. **Middleware di Protezione** (`middleware.ts`)
- ✅ Protezione automatica delle route `/dashboard/*`
- ✅ Reindirizzamento utenti autenticati da login/register
- ✅ Reindirizzamento utenti non autenticati dal dashboard

### 4. **Provider Semplificato** (`src/components/providers.tsx`)
- ✅ Rimosso context personalizzato
- ✅ Utilizzato `authClient.useSession()` nativo
- ✅ Gestione stato automatica con Better Auth

### 5. **Componenti Migliorati**
- ✅ **Login**: Gestione errori migliorata con callback `onError`/`onSuccess`
- ✅ **Registrazione**: Validazione form e feedback utente
- ✅ **Navbar**: Visualizzazione informazioni utente e gestione logout

## 🔧 Configurazione Variabili d'Ambiente

Crea un file `.env.local` con le seguenti variabili:

```env
# Database (richiesto)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# App Configuration (richiesto)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Better Auth (opzionale ma consigliato)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (opzionale - per verifica email)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"

# Social Auth (opzionale)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🛠️ Istruzioni per l'Uso

### 1. **Installazione Dipendenze**
```bash
npm install
# oppure
pnpm install
```

### 2. **Configurazione Database**
```bash
# Genera le tabelle del database
npx prisma migrate dev

# Avvia Prisma Studio (opzionale)
npx prisma studio
```

### 3. **Avvio Applicazione**
```bash
npm run dev
# oppure
pnpm dev
```

### 4. **Test Funzionalità**
- Vai su `http://localhost:3000`
- Registrati con email e password
- Accedi con le credenziali create
- Verifica il reindirizzamento automatico
- Testa il logout

## 📋 Funzionalità Disponibili

### ✅ **Implementate**
- [x] Registrazione utenti con email/password
- [x] Login con email/password
- [x] Gestione sessioni automatica
- [x] Protezione route con middleware
- [x] Logout con pulizia sessione
- [x] Gestione errori avanzata
- [x] Validazione form client-side
- [x] UI responsiva e moderna

### 🔄 **Opzionali (configurabili)**
- [ ] Verifica email (richiede configurazione SMTP)
- [ ] Login social (GitHub, Google, etc.)
- [ ] Autenticazione a due fattori
- [ ] Reset password
- [ ] Gestione profili utente

## 🚨 Risoluzione Problemi

### **Errore: "Cannot read properties of undefined"**
- Verifica che tutte le variabili d'ambiente siano configurate
- Controlla che il database sia raggiungibile

### **Errore: "Session not found"**
- Verifica che i cookie siano abilitati nel browser
- Controlla che l'URL dell'app sia configurato correttamente

### **Errore: "Database connection failed"**
- Verifica la stringa di connessione DATABASE_URL
- Assicurati che il database sia avviato

## 🔗 Documentazione Utile

- [Better Auth Docs](https://better-auth.com/docs)
- [Better Auth Next.js Integration](https://better-auth.com/docs/integrations/next)
- [Better Auth React Hooks](https://better-auth.com/docs/integrations/react)

---

**Configurazione completata!** 🎉 
Il tuo sistema di autenticazione è pronto per l'uso in produzione. 