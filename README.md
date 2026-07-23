# Aurora Di Maio — sito personale

Sito statico (HTML/CSS/JS) con un'area accademica ("Assistente") che chiama
un agente AI esterno (Codewords) per cercare articoli giuridici su un tema e
generare un saggio in PDF.

## Come funziona l'assistente di ricerca

- Nella sezione "Assistente" indichi tema, numero di articoli e (opzionale)
  un anno.
- Il sito invia questi dati a `api/agente-ricerca.js`, una funzione
  serverless che gira sul server, non nel browser.
- Quella funzione chiama il tuo agente Codewords
  (`https://runtime.codewords.ai/run/agente_ricerca_giuridica_0625ef04`)
  usando la chiave API **letta da una variabile d'ambiente**, mai scritta nel
  codice del sito.
- Il risultato (titolo, PDF, numero di articoli analizzati) torna al sito e
  viene mostrato con un link per scaricare il PDF.
- L'elaborazione richiede qualche minuto: il saggio va sempre verificato
  prima di qualunque uso accademico.

## Deploy (Vercel)

Il sito richiede una funzione serverless, quindi va ospitato su una
piattaforma che le supporti — Vercel è la più semplice:

1. Vai su [vercel.com](https://vercel.com), collega questo repository GitHub.
2. Nelle impostazioni del progetto → **Environment Variables**, aggiungi:
   - `CODEWORDS_API_KEY` = la chiave del tuo agente Codewords
3. Deploy. Vercel rileva automaticamente la cartella `api/` come funzioni
   serverless e serve `index.html` e gli asset statici dalla root.

**Importante:** la chiave API resta lato server. Non scriverla mai in
`index.html`, `css/`, `js/` o in qualunque file committato nel repository —
chiunque potrebbe leggerla dal codice sorgente della pagina e usare il tuo
agente al posto tuo.

### Limite di tempo (Vercel Hobby vs Pro)

L'agente può impiegare 3-10 minuti. Il piano **Hobby** di Vercel limita le
funzioni serverless a 60 secondi: non basta. Serve il piano **Pro** (o
superiore), con `maxDuration` alzato in `vercel.json` (già impostato a 300
secondi in questo repo — puoi alzarlo ulteriormente se necessario).

## Sviluppo locale

Per testare solo la parte statica (senza assistente funzionante):

```
python3 -m http.server 8000
```

Per testare anche l'assistente in locale serve `vercel dev` (richiede
`CODEWORDS_API_KEY` in un file `.env.local`, non committato — assicurati che
`.env.local` sia in `.gitignore`).
