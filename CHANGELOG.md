# Cambiamenti

Qui trovi le modifiche più importanti di ogni versione, dalla più recente. Il numero della versione in uso si vede nella finestra delle scorciatoie da tastiera (tasto ?). Le versioni precedenti alla 1.5.0 sono state ricostruite a posteriori, raggruppando il lavoro svolto.

## 1.6.0 - novembre 2026

### Aggiunto
- Sezione Animazione, dedicata ai film d'animazione: stesse funzioni dei film (schede, filtri, stato, voto, TMDB, gusti, saghe, statistiche) con dati separati. Il codice dei film è riusato, senza duplicazioni.
- Nella dashboard il conteggio delle animazioni viste, le ore totali e la classifica dedicate.
- Spostamento dei film in Animazione e viceversa: pulsante sulla scheda, finestra "Sposta film qui" e, in Controlla, l'elenco dei film con un genere di animazione.
- Sezione Codice per gli appunti, ispirata a Obsidian: pagine con elenco laterale e ricerca, editor in stile Markdown con anteprima, collegamenti [[Titolo]] e collegamenti in entrata.
- Importazione di file Word (.docx) in una nuova pagina ed esportazione della pagina corrente in Word.
- Barra laterale richiudibile al posto della barra in alto: icone ed etichette oppure solo icone, con transizione fluida, scelta ricordata e menu a comparsa su telefono.
- Scorciatoie M (menu laterale), C (Codice) e 0 (decima scheda).

### Modificato
- Backup e salvataggio automatico includono anche Animazione e Codice.

## 1.5.0 - novembre 2026

### Aggiunto
- Scorciatoie da tastiera: / per cercare, N per aggiungere, S per "Cosa guardo stasera?", T per il tema, B per la protezione dei dati, i numeri da 1 a 9 per cambiare scheda, ? per l'elenco e Esc per chiudere. Un pulsante in alto apre la finestra con l'elenco.
- Esportazione delle uscite delle serie in un calendario (.ics), da importare in Google Calendar o Outlook.
- Pagina Statistiche: voto medio per genere e per piattaforma, serie più lunghe e andamento nel tempo.
- Ordinamento "Per i tuoi gusti" per film e serie, con un indicatore di affinità sui titoli da guardare.
- Campo "Data di visione" per i film.
- Numero di versione dell'app nei backup JSON.
- Questo file delle modifiche.

## 1.4.0 - novembre 2026

### Aggiunto
- Protezione dei dati: salvataggio automatico su file (Chrome e Edge), richiesta di dati persistenti al browser, promemoria dell'ultimo backup, annulla dopo ogni eliminazione e anteprima prima di importare.
- Backup con numero di versione e migrazione automatica dei file più vecchi.
- Serie in corso: aggiornamento da TMDB di episodi, prossima puntata e dove guardarle, con il calendario delle prossime uscite.
- Dove guardare un titolo in Italia, copertine di film e serie e suggerimenti di titoli simili.
- LEGO: priorità nella lista dei desideri, budget totale, coda dei set da costruire e pulsanti "Comprato" e "Costruito".

## 1.3.0 - novembre 2026

### Aggiunto
- Compilazione automatica dei dati mancanti da Controlla: serie e film (TMDB), libri (Open Library) e LEGO (Rebrickable), con barra di avanzamento e elenco dei casi da verificare.
- Libri: stato di lettura con pagina corrente, autore, anno e copertina.
- LEGO: recupero di nome, pezzi e immagine dal codice del set, tempo di costruzione e costo per pezzo.

### Modificato
- JavaScript diviso in più file (dati, schermate, calcoli, TMDB e altri).
- Il progetto è pensato per l'uso in locale: le chiavi dei servizi si inseriscono dal menu Dati.
- README con screenshot e licenza MIT.

## 1.2.0 - novembre 2026

### Aggiunto
- Serie TV: episodi per ogni stagione, durata dell'episodio (di base 1 ora) e ore calcolate in automatico.
- Stato di visione delle serie (In visione, Pausata, Completata), indicazione "in corso" e progresso con stagione ed episodio.
- Ricerca TMDB per compilare i dati di una serie dal modulo.
- Controllo delle serie senza stagioni, episodi o durata.

## 1.1.0 - novembre 2026

### Aggiunto
- Ordinamento alfabetico di base, oppure per voto, genere e durata.
- Preferiti e note personali su ogni scheda.
- "Cosa guardo stasera?", la scelta casuale tra i titoli da guardare.
- Progetti con bacheca Kanban.
- Saghe e franchise, con rilevamento automatico dei raggruppamenti.
- Controlla i dati: duplicati, refusi nei titoli e dati mancanti.
- Contatori di pagine lette, ore di film e ore di serie.

### Modificato
- Dashboard riprogettata con blocchi, sezioni pieghevoli e classifiche.

## 1.0.0 - novembre 2026

### Aggiunto
- Prima versione: quattro collezioni (serie TV, film, LEGO e libri) caricate dal file cinema.xlsx in un database nel browser.
- Dashboard, schede con filtri e ricerca, aggiunta, modifica ed eliminazione.
- Esportazione in JSON, SQL ed Excel e importazione dei backup.
