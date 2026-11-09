# Meganavigatore su GitHub + Cloudflare Pages

Cartella pronta da caricare. Contiene:

```
public/index.html                  l'app (un solo file)
public/_headers                    intestazioni di sicurezza di base
functions/api/tmdb/[[path]].js     proxy per TMDB: la chiave resta sul server
.gitignore                         impedisce di caricare file con segreti
```

Come funziona: il browser chiama `/api/tmdb/...` sul tuo stesso sito, la funzione aggiunge la chiave TMDB lato server e inoltra la richiesta. La chiave non compare mai nel codice, nel repository o nel browser.

## 1. Chiave TMDB

1. Crea un account su themoviedb.org.
2. Impostazioni → API: richiedi la chiave per uso non commerciale e copia la "Chiave API" (v3) oppure il "Token di accesso in lettura" (v4). Vanno bene entrambi.

## 2. GitHub

1. Crea un repository nuovo (può essere privato).
2. "Add file" → "Upload files" e trascina dentro il contenuto di questa cartella, mantenendo le sottocartelle `public` e `functions`. Il file `.gitignore` può non comparire nelle anteprime: se non lo carichi, evita comunque di caricare file chiamati `.dev.vars` o `.env`.
3. Conferma con "Commit changes".

## 3. Cloudflare Pages

I nomi dei menu possono cambiare leggermente nel tempo.

1. Nel pannello Cloudflare: Workers & Pages → Create → Pages → Connect to Git, e scegli il repository.
2. Impostazioni di build:
   - Framework preset: None
   - Build command: lascia vuoto
   - Build output directory: `public`
3. Salva e avvia il deploy.
4. Poi vai in Settings → Variables and Secrets del progetto e aggiungi un segreto (tipo "Secret", cifrato):
   - Nome: `TMDB_API_KEY`
   - Valore: la tua chiave o il tuo token
   Aggiungilo per l'ambiente Production (e Preview, se lo usi).
5. Rifai il deploy (Deployments → Retry deployment, oppure fai un nuovo commit). Le variabili si applicano solo ai deploy successivi.

## 4. Prova

Apri `https://NOME-PROGETTO.pages.dev`, aggiungi o modifica una serie TV e premi "Cerca su TMDB".

Messaggi possibili:
- "Il server non ha la chiave TMDB": il segreto non è stato aggiunto, o manca il nuovo deploy.
- "Imposta la chiave TMDB...": la funzione non è stata trovata. Controlla che la cartella `functions` sia nella radice del repository, non dentro `public`.
- "Troppe richieste": TMDB ha risposto 429. L'app aspetta e riprova una volta.

## Aggiornare l'app

Quando ricevi un nuovo `index.html`, sostituisci il file `public/index.html` su GitHub. Cloudflare ripubblica da solo.

## Sicurezza, in breve

- Non scrivere mai la chiave in un file del repository. Per provare in locale, crea un file `.dev.vars` con la riga `TMDB_API_KEY=...` (è già ignorato da Git) e avvia `npx wrangler pages dev public`.
- Se una chiave finisce per sbaglio su GitHub, rigenerala dal pannello TMDB: resta nella cronologia anche se cancelli il file.
- Il proxy accetta solo la ricerca serie e i dettagli di una serie, rifiuta le richieste da altri siti web e passa a TMDB solo i parametri `query`, `language` e `page`. Non ferma però chi lo chiama con strumenti da riga di comando: chi conosce l'indirizzo potrebbe consumare le richieste gratuite del piano Workers. Per un uso personale è un rischio piccolo; se vuoi ridurlo, aggiungi una regola di rate limiting in Cloudflare o limita l'accesso al sito.
- Pages gratuito: build limitate al mese e richieste statiche illimitate, mentre le funzioni contano sulla quota giornaliera di Workers. Controlla i valori aggiornati nel pannello di Cloudflare.

## TMDB: attribuzione

L'uso gratuito è per progetti non commerciali e richiede di citare TMDB. In fondo alla pagina c'è già l'avviso richiesto. Scarica il logo ufficiale dalla pagina dei loghi di TMDB e salvalo come `public/tmdb-logo.svg`: se il file manca, l'immagine non viene mostrata e resta solo il testo.

## Cosa NON cambia

I dati (film, serie, LEGO, libri, progetti) restano nel browser di chi usa il sito, in IndexedDB. Su un altro dispositivo i dati saranno vuoti. Usa Esporta/Importa dal menu Dati per spostare un backup.
