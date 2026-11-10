# 🎬 Meganavigatore

Un'applicazione web per tenere in ordine le proprie collezioni personali: **serie TV, film, set LEGO e libri**. Funziona nel browser, con tre soli file (HTML, CSS e JavaScript), senza installare nulla e senza server: i dati restano sul tuo dispositivo.

Nata da un foglio Excel (`cinema.xlsx`), che è servito come punto di partenza per riempire il database iniziale.

## Cosa contiene

### 🏠 Dashboard
- Numeri principali: film visti, serie viste, libri letti, con la media dei voti.
- Tempo dedicato: ore di film, ore di serie TV e pagine lette.
- Classifiche con i 5 titoli più votati e i 5 più rivisti, per film e per serie.
- Grafici dei generi più guardati, delle piattaforme e della distribuzione dei voti.
- Riepilogo di LEGO (pezzi montati, set costruiti, wishlist) e libri.
- Pulsante **🎲 Cosa guardo stasera?**, che pesca a caso tra i titoli "da guardare" filtrando per tipo, piattaforma, genere e tempo disponibile.

### 📚 Le quattro collezioni
- **Serie TV**, **Film**, **LEGO** e **Libri**, con schede colorate, badge per voto, stato e piattaforma.
- Ricerca in tempo reale, filtri per genere, piattaforma, stato, saga e preferiti.
- Ordinamento alfabetico di base, oppure per voto, genere, durata o tempo di visione.
- Aggiunta, modifica ed eliminazione di ogni elemento.
- Preferiti ⭐ e note personali su ogni scheda.

### 📺 Stato delle serie TV
- Ogni serie può essere **In visione**, **Pausata** o **Completata**, e puoi indicare se è ancora **in corso** (nuove stagioni in uscita).
- Per le serie in visione o in pausa indichi stagione ed episodio raggiunti. Un pulsante "➕ Un episodio" nella dashboard li fa avanzare.
- La dashboard ha una sezione con le serie in visione e l'avanzamento. Ore ed episodi visti si calcolano in base allo stato: le serie completate contano per intero, quelle in corso solo fino all'episodio raggiunto.

### 📺 Serie TV con episodi per stagione
- Per ogni serie puoi indicare gli episodi di ciascuna stagione e la durata di un episodio (di base 1 ora).
- Le ore totali vengono calcolate in automatico. Dove i dati mancano, il programma usa una stima di 10 episodi per stagione e lo segnala con "≈".
- Con una chiave API gratuita di **TMDB** i dati di una serie (stagioni, episodi, durata, genere, piattaforma) si compilano con un clic.

### 👑 Saghe e franchise
- Collega film, serie, libri e set LEGO dello stesso mondo, per esempio Harry Potter.
- Per ogni saga: avanzamento, voto medio, tempo totale per vedere tutto, ordine di visione e "ti manca…".
- La funzione **Rileva saghe** propone i raggruppamenti partendo dai titoli.

### 📋 Progetti (Kanban)
- Bacheca con le colonne Da fare, In corso e Completato.
- Partecipanti del team e attività assegnate, con avanzamento in percentuale.
- Le attività si spostano trascinandole oppure con le frecce.

### 🧹 Controlla i dati
- Trova duplicati, refusi nei titoli e dati mancanti.
- Elenca le serie TV senza stagioni, episodi per stagione o durata dell'episodio, con filtri e accesso diretto alla modifica.
- Offre la correzione dei refusi e una coda guidata per completare i dati un titolo alla volta.

### 💾 Dati, backup e tema
- Esporta in **JSON**, **SQL** o **Excel** e reimporta i backup (JSON o Excel).
- Ripristino dei dati originali del file di partenza.
- Tema chiaro e scuro.

## Come scaricarlo e usarlo

### Opzione 1: aprirlo online
Se il sito è pubblicato, apri l'indirizzo del progetto (per esempio `https://NOME-PROGETTO.pages.dev`).

### Opzione 2: scaricarlo sul computer
1. Su GitHub premi il pulsante verde **Code** e scegli **Download ZIP**.
2. Estrai lo ZIP in una cartella.
3. Apri il file `public/index.html` con un doppio clic, usando Chrome, Edge o Firefox. I file `style.css` e `app.js` devono restare nella stessa cartella.

Chi usa Git può invece clonare il repository:

```
git clone https://github.com/NOME-UTENTE/NOME-REPOSITORY.git
```

Poi apri `public/index.html` nel browser.

Alla prima apertura il database si riempie con i dati iniziali. Da quel momento ogni modifica viene salvata nel browser.

## Cose da sapere

- **I dati sono nel browser.** Restano in quel browser e su quel dispositivo: se cambi computer, browser o cancelli i dati di navigazione, parti da zero. Usa **💾 Dati → Esporta** per fare i backup e **Importa** per ripristinarli.
- **Chiave TMDB.** Per usare la ricerca su TMDB aprendo il file in locale, vai in **💾 Dati → 🔑 Chiave TMDB** e incolla la tua chiave gratuita (la ottieni su themoviedb.org, in Impostazioni → API). La chiave resta solo nel browser e non entra nei backup.
- **Internet serve solo per due cose:** la ricerca su TMDB e l'esportazione o importazione in Excel, che usa una libreria caricata da internet.
- **Privacy.** I dati di partenza del file Excel sono incorporati dentro `public/app.js`. Se il repository è pubblico, chiunque può leggere quella lista: se non vuoi, rendi il repository privato.

## Com'è fatto

- Tre file separati (HTML, CSS e JavaScript), senza framework e senza passaggi di compilazione.
- Database nel browser con IndexedDB, in cinque tabelle: `serie_tv`, `film`, `lego`, `libri` e `progetti`.
- Libreria SheetJS (da cdnjs) per i file Excel.
- Per la versione online: una funzione di Cloudflare Pages (`functions/api/tmdb`) che fa da proxy verso TMDB, così la chiave resta sul server.

```
public/index.html                  la pagina (struttura HTML)
public/style.css                   l'aspetto grafico
public/app.js                      la logica e i dati iniziali
public/_headers                    intestazioni di sicurezza
functions/api/tmdb/[[path]].js     proxy per TMDB (versione online)
```

## Pubblicare online

L'app si pubblica gratis su Cloudflare Pages collegando il repository GitHub: cartella di output `public`, comando di build vuoto, e un segreto `TMDB_API_KEY` nelle impostazioni del progetto. La procedura passo per passo è nel file `DEPLOY.md`.

## Crediti

I dati delle serie TV provengono da TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
