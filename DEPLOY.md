# Pubblicare il Meganavigatore su GitHub + Cloudflare Pages

Come funziona: il browser chiama `/api/...` sul tuo stesso sito, e una piccola funzione aggiunge la chiave del servizio lato server e inoltra la richiesta. Le chiavi non compaiono mai nel codice, nel repository o nel browser.

## 1. Chiavi

- **TMDB** (necessaria per serie e film): crea un account su themoviedb.org, Impostazioni → API, e copia la "Chiave API" (v3) oppure il "Token di accesso in lettura" (v4).
- **Rebrickable** (facoltativa, per i set LEGO): account su rebrickable.com, chiave gratuita in Account → Impostazioni → API.
- **Open Library** (libri): non serve nessuna chiave.

## 2. GitHub

1. Crea un repository nuovo (può essere privato).
2. "Add file" → "Upload files" e trascina dentro il contenuto della cartella, mantenendo le sottocartelle `public`, `functions` e `docs`.
3. Non caricare mai file chiamati `.dev.vars` o `.env`.
4. Conferma con "Commit changes".

## 3. Cloudflare Pages

I nomi dei menu possono cambiare leggermente nel tempo.

1. Workers & Pages → Create → Pages → Connect to Git, e scegli il repository.
2. Impostazioni di build:
   - Framework preset: None
   - Build command: lascia vuoto
   - Build output directory: `public`
3. Salva e avvia il deploy.
4. In Settings → Variables and Secrets del progetto aggiungi i segreti (tipo "Secret"):
   - `TMDB_API_KEY`: la chiave o il token TMDB
   - `REBRICKABLE_API_KEY`: la chiave Rebrickable (se la usi)
   - `OL_CONTACT`: facoltativo, un tuo indirizzo email o sito che Open Library vede come contatto
5. Rifai il deploy (Deployments → Retry deployment, oppure un nuovo commit): i segreti valgono dai deploy successivi.

## 4. Prova

Apri `https://NOME-PROGETTO.pages.dev`, aggiungi o modifica una serie e premi "Cerca su TMDB". Prova anche un libro (Open Library) e un set LEGO (Rebrickable).

Messaggi possibili:
- "Il server non ha la chiave...": il segreto manca o serve un nuovo deploy.
- "Imposta la chiave...": le funzioni non sono state trovate. Controlla che la cartella `functions` sia nella radice del repository, non dentro `public`.
- "Troppe richieste": il servizio ha risposto 429. L'app aspetta e riprova una volta.

## Aggiornare l'app

Quando ricevi file nuovi, sostituisci quelli corrispondenti su GitHub. Cloudflare ripubblica da solo.

## Sicurezza, in breve

- Non scrivere mai le chiavi in un file del repository. In locale usa un file `.dev.vars` (già ignorato da Git) con righe come `TMDB_API_KEY=...` e avvia `npx wrangler pages dev public`.
- Se una chiave finisce per sbaglio su GitHub, rigenerala: resta nella cronologia anche se cancelli il file.
- Le funzioni accettano solo i percorsi che servono all'app, rifiutano le richieste da altri siti web e passano ai servizi solo i parametri previsti. Non fermano però chi le chiama da riga di comando: chi conosce l'indirizzo potrebbe consumare le richieste gratuite del piano. Per un uso personale il rischio è piccolo; per ridurlo aggiungi una regola di rate limiting in Cloudflare o limita l'accesso al sito.
- Controlla nel pannello di Cloudflare i limiti aggiornati del piano gratuito.

## Privacy dei dati di partenza

La tua lista iniziale è in `public/js/seed.js`. In un repository pubblico è leggibile da chiunque: rendi il repository privato oppure sostituisci il contenuto di quel file con `const SEED={};`.

## Attribuzione TMDB

In fondo alla pagina c'è già l'avviso richiesto. Scarica il logo ufficiale dalla pagina dei loghi di TMDB e salvalo come `public/tmdb-logo.svg`: se il file manca, resta solo il testo.
