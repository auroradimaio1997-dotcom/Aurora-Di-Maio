# Aurora Di Maio — sito personale

Sito statico (HTML/CSS/JS) con un'area accademica che genera bozze di saggio
tramite l'API di Claude, a partire **solo** dai documenti che carichi tu.

## Perché non è collegato direttamente a OneLegale

OneLegale (Wolters Kluwer) è un portale ad accesso autenticato, senza API
pubblica nota. La maggior parte delle banche dati giuridiche in abbonamento
vieta nei propri termini di servizio l'accesso automatizzato/scraping, anche
con un login legittimo. Per questo l'assistente non si collega a OneLegale:
tu cerchi e scarichi i materiali a mano (accesso umano, sempre consentito dal
tuo abbonamento), poi li carichi o incolli nel sito — l'agente scrive
esclusivamente a partire da quei testi, senza consultare altre fonti.

Se in futuro Wolters Kluwer ti fornisce un'API ufficiale per il tuo piano,
si può integrare in `api/genera-saggio.js` in modo legittimo.

## Deploy (Vercel)

Il sito richiede una funzione serverless (`api/genera-saggio.js`), quindi va
ospitato su una piattaforma che le supporti — Vercel è la più semplice:

1. Vai su [vercel.com](https://vercel.com), collega questo repository GitHub.
2. Nelle impostazioni del progetto → **Environment Variables**, aggiungi:
   - `ANTHROPIC_API_KEY` = la tua chiave API Claude (da [console.anthropic.com](https://console.anthropic.com))
3. Deploy. Vercel rileva automaticamente la cartella `api/` come funzioni serverless
   e serve `index.html` e gli asset statici dalla root.

**Importante:** la chiave API resta lato server (nella funzione), non è mai
esposta nel browser. Non committarla mai nel codice o nel repository.

## Sviluppo locale

Per testare solo la parte statica:

```
python3 -m http.server 8000
```

Per testare anche l'assistente in locale serve `vercel dev` (richiede
`ANTHROPIC_API_KEY` in un file `.env.local`, non committato).

## Come funziona l'assistente di ricerca

- Nella sezione "Assistente" del sito, carichi file `.txt`/`.md` oppure
  incolli del testo (es. estratti copiati da OneLegale o altre tue fonti).
- L'assistente scrive una bozza di saggio usando **esclusivamente** quei
  documenti, citando le fonti con `[1]`, `[2]`, ecc.
- Se i documenti non coprono un aspetto del tema, lo dichiara invece di
  inventare contenuto.
- Le bozze generate vanno sempre verificate prima di qualunque uso accademico.
