# 📚 SchoolEventDays - Event Registration System

Sistema di gestione eventi su due giorni con registrazione sessioni orarie, verifica email OTP, e aggiornamenti real-time tramite WebSocket.

![Inserimento corsi 1 preview](./screenshots/inserimentoCorsi1.png)
![Inserimento corsi 2 preview](./screenshots/inserimentoCorsi2.png)
![Inserimento corsi 3 preview](./screenshots/inserimentoCorsi3.png)
![Popup codice verifica preview](./screenshots/verificaCodice1.png)
![Email codice verifica preview](./screenshots/emailCodiceVerifica.png)
<!-- ![Codice errato preview](./screenshots/codiceSbagliato.png)
![Tempo per il codice scaduto preview](./screenshots/tempoCodiceScaduto.png) -->
![Registrazione 1 preview](./screenshots/registrazione1.png)
![Registrazione 1 preview](./screenshots/registrazione2.png)
![Email conferma corsi preview](./screenshots/emailConfermaCorsi.png)
![Corsi presenti preview](./screenshots/corsiPresenti.png)

## 📋 Indice
- [Caratteristiche](#-caratteristiche)
- [Tecnologie](#️-tecnologie)
- [Prerequisiti](#-prerequisiti)
- [Installazione](#-installazione)
- [Configurazione](#️-configurazione)
- [Utilizzo](#-utilizzo)
- [Struttura del progetto](#-struttura-del-progetto)
- [WebSocket Events](#-websocket-events)
- [Security Features](#️-security-features)
- [Deploy](#-deploy)
- [Autore](#-autore)
- [Licenza](#-licenza)

## ✨ Caratteristiche

### Core Features
- ✅ **Creazione Corsi** con verifica email OTP (6 cifre)
- ✅ **Registrazione Studenti** a sessioni orarie personalizzabili
- ✅ **Eventi su 2 giorni** con 5 ore per giorno
- ✅ **Email di conferma** automatica post-registrazione
- ✅ **Gestione posti disponibili** real-time
- ✅ **WebSocket** per aggiornamenti live della disponibilità
- ✅ **Supporto corsi multi-ora** (1, 2, 4, 5 ore)
- ✅ **Referenti multipli** (fino a 4 interni + esterni)
- ✅ **Rate limiting** per protezione da spam

### Email System
- 📧 **Email OTP** per verifica creazione corso (6 cifre, 5 min validità)
- 📧 **Email conferma** registrazione con riepilogo corsi scelti
- 📧 **Template HTML** responsive e professionali
- 📧 **Gmail SMTP** con App Password security

### Real-time Updates
- ⚡ **WebSocket** per comunicazione bidirezionale
- ⚡ **Aggiornamenti live** posti disponibili
- ⚡ **Auto-refresh** lista corsi quando posti si esauriscono

## 🛠️ Tecnologie

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** (v5.2.1) - Web framework
- **MySQL2** (v3.16.0) - Database relazionale
- **WebSocket (ws)** (v8.18.3) - Comunicazione real-time
- **Redis** (v5.11.0) - Cache e rate limiting store
- **Nodemailer** (v7.0.12) - Invio email
- **express-rate-limit** (v8.2.1) - Rate limiting middleware
- **dotenv** (v17.2.3) - Environment variables

### Frontend
- **HTML5/CSS3** - Markup e styling
- **JavaScript Vanilla** - Logica client-side
- **WebSocket API** - Connessione real-time

### Development
- **Nodemon** (v3.1.11) - Auto-restart su modifiche

## 📦 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- [Node.js](https://nodejs.org/) v18 o superiore
- [MySQL](https://www.mysql.com/) v8 o superiore
- [Redis](https://redis.io/) v6 o superiore (per rate limiting)
- [Git](https://git-scm.com/) per clonare il repository
- Account Gmail per invio email (con App Password abilitata)

### Verifica installazioni
```bash
node --version  # v18.0.0+
npm --version   # v9.0.0+
mysql --version # v8.0.0+
redis-server --version # v6.0.0+
```

## 🚀 Installazione

### 1. Clona il repository
```bash
git clone https://github.com/tuousername/SchoolEventDays.git
cd SchoolEventDays
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Configura il database MySQL

Crea il database e importa lo schema:
```bash
# Accedi a MySQL
mysql -u root -p

# Crea il database
CREATE DATABASE SchoolEventDays;
USE SchoolEventDays;

# Importa lo schema
source schema.sql;
```

### 4. Avvia Redis
```bash
# macOS (con Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Windows (con installer)
redis-server

# Verifica che Redis sia attivo
redis-cli ping
# Risposta: PONG
```

### 5. Configura Gmail per invio email

**Crea App Password per Gmail:**
1. Vai su https://myaccount.google.com/apppasswords
2. Attiva "Verifica in due passaggi" se non l'hai già fatto
3. Genera una App Password per "Posta"
4. Copia la password (16 caratteri)
5. Usa questa password in `.env` (NON la tua password Gmail normale)

## ⚙️ Configurazione

### Crea il file .env

Copia il file `.env.example` e rinominalo in `.env`:
```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni:

```env
# ================================
# EMAIL CONFIGURATION
# ================================
# Gmail account for sending emails
# IMPORTANT: Use App Password, not regular password
# How to get App Password: https://myaccount.google.com/apppasswords
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_16_char_app_password_here

# ================================
# DATABASE CONFIGURATION
# ================================
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=SchoolEventDays
DB_PORT=3306
DB_WAITFORCONNECTIONS=true
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# ================================
# SERVER CONFIGURATION
# ================================
SERVER_PORT=3000
```

### ⚠️ Note sulla sicurezza
- **NON** committare mai il file `.env` su Git
- Usa App Password di Gmail, non la password normale
- Cambia le password di default del database
- In produzione, usa valori diversi per ogni ambiente

## 💻 Utilizzo

### Avvia l'applicazione

```bash
# Development (con auto-restart)
npm start

# Production
NODE_ENV=production node main.js
```

L'applicazione sarà disponibile su: **http://localhost:3000**

## Test in produzione
Se si vuole testare l'app in produzione lo si può fare da: *link app in produzione su railway*
Altrimenti seguire le istruzioni qui sotto

### N.B.: 
L'applicazione è divisa in due parti distinte, una di solo per l'inserimento dei corsi, una solo per la registrazione. In diversi codici ci sono delle parti commentate riferite solo alla parte di registrazione (attiva dopo che è stata attiva quella di inserimento). Queste vanno decommentate e vanno commentate invece le parti legate solo all'inserimento dei corsi. 

### Accedi all'applicazione

1. **Inserimento Corsi:** Vai su `http://localhost:3000/inserimentoCorsi`
2. **Registrazione Studenti:** Vai su `http://localhost:3000/registrazione`

### Workflow tipico

#### **Per gli Organizzatori:**
1. Accedi a `http://localhost:3000/inserimentoCorsi`
2. Compila form con dettagli corso
3. Inserisci email referente
4. Ricevi codice OTP via email (6 cifre, valido 5 minuti)
5. Inserisci codice OTP per confermare
6. Corso creato e visibile agli studenti!

#### **Per gli Studenti:**
1. Accedi a `http://localhost:3000/registrazione`
2. Inserisci Nome, Cognome, Classe, Email
3. Seleziona corsi per ogni ora (Giorno 1 e Giorno 2)
4. Sistema verifica disponibilità posti in real-time
5. Submit registrazione
6. Ricevi email di conferma con riepilogo

## 📁 Struttura del progetto

```
SchoolEventDays/
│
├── controllers/              # Controller HTTP
│   └── controller.js        # Gestione richieste registrazione/creazione
│
├── db/                       # Database configuration
│   └── pool.js              # Connection pool MySQL
│
├── errors/                   # Error handling
│   └── httpError.js         # Custom HTTP error class
│
├── middlewares/              # Middleware Express e utility
│   ├── buildEmailHtml.function.js    # Template HTML email
│   ├── error.middleware.js
│   ├── nomeCognomeClasseEmail.js     # Validazione dati studente
│   ├── rateLimiter.function.js       # Rate limiters (Redis)
│   ├── serviceFunctions.js           # Utility functions
│   ├── validateCourse.middleware.js  # Validazione creazione corso
│   └── validateRegistration.middleware.js
│
├── public/                   # File statici (client-side)
│   ├── css/                 # Stili CSS
│   ├── js/                  # JavaScript client-side
│   │   ├── config.js        # Configurazione URL dinamici
│   │   ├── corsi.js         # Lista corsi disponibili
│   │   ├── inserimentoCorsi.js
│   │   └── registrazione.js
│   │
│   ├── limiterResponse/     # Pagine HTML errore rate limit
│   ├── corsi.html           # Pagina lista corsi
│   ├── inserimentoCorsi.html
│   ├── registrazione.html
│   ├── successInsering.html # Conferma creazione corso
│   ├── successRegistration.html # Conferma registrazione
│   ├── fail.html            # Pagina errore generico
│   └── getAll.html          # 404 custom
│
├── routes/                   # Route Express
│   └── routes.js            # Definizione endpoint
│
├── services/                 # Business logic
│   └── service.js           # Servizi registrazione/creazione
│
├── ws/                       # WebSocket management
│   └── socket.js            # WebSocket server setup
│
├── .env                      # Variabili d'ambiente (NON committare!)
├── .env.example             # Template variabili d'ambiente
├── .gitignore               # File da ignorare su Git
├── main.js                  # Entry point applicazione
├── package.json             # Dipendenze npm
├── README.md                # Questo file
├── schema.sql               # Schema database MySQL
└── race-test.js             # Script test race conditions
```

## 🔌 WebSocket Events

### Client → Server

| Event | Descrizione | Payload |
|-------|-------------|---------|
| `GET_CORSI` | Richiede lista corsi disponibili | `{type: "GET_CORSI"}` |

### Server → Client

| Event | Descrizione | Payload |
|-------|-------------|---------|
| `RESULT_GET_CORSI` | Lista corsi con posti disponibili | `{type: "RESULT_GET_CORSI", result: [...]}` |
| `DELETE_CORSO_FULL` | Rimuove corso pieno dalla lista | `{type: "DELETE_CORSO_FULL", codice_corso, giorno, ora}` |

## 🛡️ Security Features

### Email Verification
- ✅ **OTP a 6 cifre** generato con crypto.randomInt
- ✅ **Validità 5 minuti** con timestamp
- ✅ **Cleanup automatico** codici scaduti
- ✅ **Email HTML** responsive con codice evidenziato

### Input Validation
- ✅ **Validazione server-side** di tutti i dati
- ✅ **Sanitizzazione** input utente
- ✅ **Controllo formato email**
- ✅ **Validazione lunghezza** campi (nome, cognome, classe)

### Rate Limiting
- ✅ **Global rate limiter** (1500 richieste/minuto per IP)
- ✅ **Protezione contro spam** su tutti gli endpoint
- ✅ **Pagine HTML custom** per errori 429

### Database Security
- ✅ **Prepared statements** (protezione SQL injection)
- ✅ **Connection pooling** per performance
- ✅ **Credenziali da .env** (non hardcoded)
- ✅ **Transazioni atomiche** per race conditions

### WebSocket Security
- ✅ **Validazione messaggi** JSON
- ✅ **Try-catch** su message handlers
- ✅ **Broadcast controllato** (solo quando necessario)

## 🌐 Deploy

### Railway (Consigliato)

```bash
# Installa Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inizializza progetto
railway init

# Aggiungi MySQL plugin
railway add mysql

# Aggiungi Redis plugin
railway add redis

# Deploy
railway up
```

**Configura variabili d'ambiente su Railway:**
1. Dashboard → Project → Variables
2. Aggiungi tutte le variabili da `.env`
3. Railway auto-configura `DATABASE_URL` e `REDIS_URL`

**Importa schema database:**
```bash
railway run mysql --host=$MYSQLHOST --user=$MYSQLUSER --password=$MYSQLPASSWORD $MYSQLDATABASE < schema.sql
```

### Post-Deploy Checklist
- ✅ Configura tutte le variabili d'ambiente
- ✅ Importa schema database
- ✅ Testa connessione Redis
- ✅ Verifica invio email (Gmail App Password)
- ✅ Testa registrazione completa end-to-end

## 📊 Database Schema

### Tabelle Principali

**`corso`** - Corsi creati dagli organizzatori
- `codice_corso` (PK)
- `nome`, `descrizione`
- `nome_cognome_classe_ref1-4` (referenti interni)
- `nome_ref_esterni` (referenti esterni)
- `n_ore` (durata: 1, 2, 4, 5 ore)
- `giorno1`, `giorno2` (disponibilità giorni)
- `posti_1_1` ... `posti_2_5` (posti per ora)
- `email_ref` (email referente per OTP)

**`elenco_iscritti_giorno1`** - Registrazioni studenti giorno 1
- Nome, Cognome, Classe, Email
- `prima_ora` ... `quinta_ora` (corsi scelti)

**`elenco_iscritti_giorno2`** - Registrazioni studenti giorno 2
- Struttura identica a giorno 1

**`elenco_relatori`** - Cache relatori
- `nome`, `cognome`, `classe`

**`email_con_codice`** - OTP temporanei
- `codice` (6 cifre)
- `email`
- `orario` (timestamp per validità 5 min)

## 🎓 Use Cases

### Eventi Scolastici
- Giornate didattiche alternative
- Workshop multi-sessione
- Conferenze studentesche
- Open day con sessioni parallele

### Eventi Formativi
- Corsi di formazione aziendale
- Bootcamp con moduli orari
- Conference con track multipli
- Webinar series

### Eventi Accademici
- Orientamento universitario
- Giornate della ricerca
- Seminari tematici
- Career day

## 👨‍💻 Autore

**Samuele Mastrovincenzo**

- 🐙 GitHub: [@samueleee1016](https://github.com/samueleee1016)
- 📧 Email: samuele.mastrovincenzo@gmail.com

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fork il progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

<!-- ## 📄 Licenza

Questo progetto è rilasciato sotto licenza **MIT**. Vedi il file [LICENSE](LICENSE) per i dettagli.

--- -->

## 🙏 Ringraziamenti

- Express.js team per il framework
- Nodemailer team per il sistema email
- MySQL team per il database
- Comunità Node.js per supporto

---

<!-- <div align="center">

**⭐ Se questo progetto ti è stato utile, lascia una stella! ⭐**

</div> -->
