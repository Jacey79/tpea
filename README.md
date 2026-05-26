# TPEA — The Pain Expression Atlas

A static web app for mining pain-associated genes across mammalian models.
All data lives in **CSV files** under [`data/`](data/) — edit a CSV, push to
GitHub, and the site updates. No build step. No database. No server required.

```
┌───────────────────┐     fetch()     ┌───────────────────┐
│  Browser          │ ─────────────▶  │  data/*.csv       │
│  (any HTML page)  │                 │  (text files in   │
│  js/data.js       │ ◀───────────────│   the repo)       │
└───────────────────┘                 └───────────────────┘
        │
        └─ assembles window.TPEA_DATA, same shape the front-end has always used
```

## 1. Project layout

```
.
├── index.html                  Home (search hero + welcome)
├── browse.html                 Filter by model / species / source
├── search.html                 Builder-style multi-field search
├── entry.html                  Single TPEA entry detail page
├── painmodel.html              Single pain-model description page
├── download.html               Bulk TSV download (zip)
├── help.html                   Pain-model / pain-type encyclopedia
├── citation.html, contact.html
│
├── css/style.css
├── js/
│   ├── data.js                 Loads data/*.csv → window.TPEA_DATA
│   ├── layout.js               Site chrome / utility helpers (unchanged)
│   └── data.original.js        Original hard-coded data, kept for reference
│
├── data/                       ★ all source data lives here as CSV ★
│   ├── records.csv             Main TPEA records (one row per entry)
│   ├── genes.csv               Gene symbol → Ensembl IDs per species
│   ├── pain_models.csv         Pain model catalog (description + reference)
│   ├── pain_types.csv          Pain type + assessment dictionary
│   ├── tissues.csv             Source / tissue list
│   ├── tissue_cell_catalog.csv Cell-line catalog (used by download page)
│   ├── evidence_sequencing.csv High-throughput profiling rows (HTP)
│   ├── evidence_expression.csv Validated differential expression rows (VDE)
│   ├── evidence_perturbation.csv  Validated perturbation rows (VP)
│   ├── diseases.csv            gene → disease associations
│   └── variants.csv            gene → variant rows
│
├── backend/                    Optional Python REST API (local dev only)
│   ├── app.py                  FastAPI app reading the same CSVs
│   ├── requirements.txt
│   └── README.md
│
├── scripts/                    One-off / maintenance helpers
│   ├── export_main_data_to_csv.js   Node — dumps original data.js to CSV
│   ├── make_evidence_templates.py   Python — recreates the evidence CSV templates
│   ├── wrap_async.py                Python — wraps inline scripts in async IIFE
│   └── _test_loader.js              Node sanity check for the CSV loader
│
├── .github/workflows/deploy.yml   Optional GitHub Actions deploy
├── .nojekyll                      Tells GitHub Pages to skip Jekyll
└── DATA_SCHEMA.md                 Per-CSV column reference
```

## 2. Run it locally

The front-end uses `fetch()`, so it must be served by an HTTP server. Opening
`index.html` directly with `file://` will not work.

```bash
# from the repo root
python3 -m http.server 8080
# then open http://127.0.0.1:8080/
```

Any static server works (`npx serve`, `php -S`, Nginx, …). The repo is
self-contained: no npm install, no compile step.

If you want a real REST API backing the same CSVs, see
[`backend/README.md`](backend/README.md).

## 3. Updating the data — the everyday workflow

The site has **no build step**. To edit data:

1. Open the relevant CSV in `data/` (Excel, Numbers, Google Sheets, VS Code,
   LibreOffice — anything that handles UTF-8 CSV).
2. Add / change / delete rows. Keep the header row intact.
3. Save the file as **comma-separated, UTF-8**.
4. Commit and push:
   ```bash
   git add data/records.csv
   git commit -m "data: add 5 new TRPV1 records for SNI model"
   git push
   ```
5. GitHub Pages automatically redeploys within ~1 minute. Refresh the browser
   and the new data is live.

That's it. The same workflow applies to every CSV in `data/`.

> See [`DATA_SCHEMA.md`](DATA_SCHEMA.md) for the columns of every CSV, plus
> what values each column accepts.

### Common edits

| You want to…                           | Edit                                |
| -------------------------------------- | ----------------------------------- |
| Add a new TPEA entry                   | `records.csv` (+ matching rows in `evidence_*.csv`) |
| Add a new gene / new Ensembl ID        | `genes.csv` |
| Add a new pain model                   | `pain_models.csv` |
| Add evidence rows for an existing entry| `evidence_sequencing.csv` / `evidence_expression.csv` / `evidence_perturbation.csv`, and bump the `seq` / `expr` / `pert` count in `records.csv` |
| Link a gene to additional diseases     | `diseases.csv` |
| Add gene variants                      | `variants.csv` |

### Keeping counts in sync

`records.csv` has three columns — `seq`, `expr`, `pert` — that record **how
many evidence rows exist for that TPEA entry**, and a fourth column
`confidence` = `seq + expr + pert`. When you add new rows to the evidence
CSVs, increment the matching count manually. (The script
`scripts/recount_evidence.py` can do this for you in bulk — see below.)

## 4. Deploying to GitHub Pages (no server, free)

You have two options. **Option A is the recommended path for this repo** —
the simpler one and the one this project is built for.

### Option A — Branch publishing (zero config)

1. Create a new GitHub repository (public). Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial TPEA commit"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages**.
   * **Source**: *Deploy from a branch*
   * **Branch**: `main` · **Folder**: `/ (root)`
   * Click **Save**.
3. Wait ~1 min. Your site is live at
   `https://<you>.github.io/<repo>/`.
4. Every subsequent `git push` to `main` redeploys automatically.

This works because GitHub Pages serves any static files in the chosen
branch/folder, and our entry file (`index.html`) is at the top level.

The `.nojekyll` file in the repo root tells Pages to skip Jekyll
processing (we don't want it — it can mangle filenames starting with `_`).

### Option B — GitHub Actions (more control)

The repo already includes `.github/workflows/deploy.yml`. To use it:

1. On GitHub: **Settings → Pages** → **Source: GitHub Actions**.
2. Push to `main`. The workflow uploads the whole repo as a Pages artifact
   and deploys it.

Use this option if you later want to add a build step (image compression,
gzip pre-compression, etc.) or if your account requires Actions-based
publishing.

### Troubleshooting

| Symptom                                            | Fix |
| -------------------------------------------------- | --- |
| `Failed to fetch data/records.csv` red banner      | You opened `index.html` over `file://`. Serve it over HTTP. |
| Site loads but tables are empty                    | The CSVs were renamed / moved. They must be at `data/<name>.csv` relative to repo root. |
| GitHub Pages shows 404                             | Confirm the repo is public, that you picked the correct branch in Settings → Pages, and that `index.html` is at repo root. |
| Pushed changes but site still old                  | Pages cache TTL is up to a minute. Hard-refresh (Ctrl-F5) or open the Actions tab and confirm the latest run succeeded. |
| You see `gh-pages` mentioned in old guides         | Ignore — that's a legacy convention. With Option A, your *publishing source* is just `main` / root. |

## 5. Regenerating the data files from scratch

If you ever blow away `data/` and need to start over from the original
hard-coded JavaScript:

```bash
# 1) Restore the "ground truth" CSVs from the original data.js
node scripts/export_main_data_to_csv.js js/data.original.js

# 2) Recreate the (empty) evidence templates
python3 scripts/make_evidence_templates.py
```

`scripts/export_main_data_to_csv.js` is purely a migration tool. Once you
have CSVs, you never need to run it again — the site reads CSVs directly.

## 6. Why CSV (not JSON, not a database)?

* **Human editable**: Anyone with Excel / Numbers / Google Sheets can update
  the dataset without touching code.
* **Diff-friendly**: A line-by-line CSV diff in a pull request makes data
  changes reviewable.
* **Static-host friendly**: Tiny text files served by any HTTP server. No
  DB credentials, no migrations, no infra costs.
* **Future-proof**: When you outgrow CSV, the same files can be imported
  into Postgres / SQLite / DuckDB / pandas in one line.

## 7. License & citation

Content is intended to be released under **CC-BY-4.0**; see
[`citation.html`](citation.html). The front-end code (HTML / CSS / JS)
inherits the license from the original TPEA distribution.
