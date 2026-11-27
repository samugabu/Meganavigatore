# MyMultyScreen

Web app personale per catalogare e tenere traccia di serie TV, film, animazioni, set LEGO e libri. Funziona interamente nel browser, senza server e senza database esterni: i dati restano sul tuo dispositivo.

Versione corrente: 2.7.0-ultimate

## Funzionalità

- **Dashboard**: numeri della collezione, tempo dedicato, classifiche, analisi per generi e piattaforme, riepilogo LEGO e libri.
- **Cataloghi**: Serie TV, Film, Animazione, LEGO e Libri, con vista a griglia o a tabella, filtri, ordinamenti, voti, rewatch e lista dei titoli da guardare o leggere.
- **Calendario & In corso**: serie in visione con avanzamento per episodio e calendario delle prossime uscite, con esportazione in formato ICS.
- **Cosa guardo stasera?**: suggerimento rapido, nella barra in alto e con il tasto S.
- **Saghe**: raggruppamento dei titoli per saga, con ordine personalizzabile.
- **Statistiche**: riepilogo annuale, mappa di attività, Titan Arena (classifica a sfide), Hall of Fame dei personaggi inseriti a mano con classifica generale e una per ogni valore, voto medio per genere e per piattaforma.
- **Trofei**: obiettivi sbloccabili in base a quanto hai visto e letto.
- **AI locale**: consigli personalizzati calcolati nel browser sulla base dei tuoi voti e generi, senza API esterne.
- **Controlla**: ricerca di duplicati, titoli simili, segnaposto, refusi, generi non coerenti e schede incomplete, con compilazione automatica dei dati mancanti da TMDB.
- **Progetti**: bacheca di attività in colonne (da fare, in corso, completato).
- **Codice**: appunti e pagine di testo, con importazione da file Word.
- **Sistema & backup**: stato dell'archiviazione e gestione dei backup.
- **Account**: profili locali, ognuno con il proprio database.

## Struttura del progetto

```
index.html   struttura della pagina
style.css    stili e temi chiaro/scuro
script.js    logica dell'applicazione e dati iniziali
README.md    questo file
```

## Avvio

Apri `index.html` in un browser moderno.

Per il funzionamento come app installabile (PWA) e per alcune funzioni del browser serve servire i file via HTTP. In locale, dalla cartella del progetto:

```
python3 -m http.server 8000
```

poi apri `http://localhost:8000`.

### Pubblicazione su GitHub Pages

1. Carica i quattro file nella radice del repository.
2. In Settings, sezione Pages, scegli il branch principale e la cartella root.
3. L'app sarà raggiungibile all'indirizzo che GitHub mostra nella stessa pagina.

## Configurazione

Le chiavi API non sono incluse nel repository: si inseriscono dall'app e vengono salvate solo nel browser.

- **TMDB**: serve per episodi, date delle prossime puntate, piattaforme di streaming, locandine, consigli e compilazione automatica. Si ottiene gratuitamente su themoviedb.org, in Impostazioni, sezione API.
- **Rebrickable**: serve per i dati dei set LEGO. Si ottiene gratuitamente su rebrickable.com, in Account, Impostazioni, API.

## Dati e backup

- I cataloghi sono salvati in IndexedDB, uno per profilo. Le impostazioni sono salvate in localStorage.
- Esportazione dei dati in JSON (backup completo), SQL e Excel.
- Salvataggio automatico su un file locale nei browser che supportano la File System Access API.
- Cancellare i dati del sito dal browser elimina anche i dati dell'app: conserva sempre un backup JSON recente.

## Scorciatoie da tastiera

| Tasto | Azione |
| --- | --- |
| / | Cerca nella scheda corrente |
| N | Aggiungi un elemento |
| S | Cosa guardo stasera? |
| T | Cambia tema chiaro o scuro |
| B | Protezione dei dati |
| C | Apri Codice (appunti) |
| M | Apri o chiudi il menu laterale |
| ? | Mostra l'elenco delle scorciatoie |
| Esc | Chiudi le finestre ed esci dalla ricerca |

Le scorciatoie non funzionano mentre si scrive in un campo o con una finestra aperta.

## Dipendenze esterne

- Google Fonts (JetBrains Mono, Plus Jakarta Sans).
- SheetJS 0.18.5, caricata da cdnjs, per l'esportazione in Excel.
- API di TMDB e di Rebrickable, solo se inserisci le relative chiavi.
- Facoltativo: un file `tmdb-logo.svg` nella radice del progetto per mostrare il logo TMDB nel piede di pagina. Se manca, il logo viene semplicemente nascosto.

## Crediti

Questo prodotto usa le API di TMDB ma non è approvato né certificato da TMDB. I dati sulla disponibilità in streaming sono forniti da JustWatch.
