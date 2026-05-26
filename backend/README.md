# TPEA Backend (optional, local dev)

A small FastAPI server that reads the same CSV files in `../data/` and
exposes them as a REST API. **You do not need this to run the site** — the
front-end already reads CSVs directly. Use this backend when you want:

* A REST surface to hit from notebooks / scripts / other apps
* Server-side filtering (faster on very large datasets)
* A starting point for putting TPEA behind a real database, auth, etc.

Note: GitHub Pages cannot host this backend (Pages is static-only). If you
want it on the public web, deploy to a free-tier Python host
(Render, Railway, Fly.io, PythonAnywhere, …) or a VPS.

---

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt

uvicorn app:app --reload --port 8000
```

Then open:

* `http://127.0.0.1:8000/`            — the front-end (served directly)
* `http://127.0.0.1:8000/docs`        — auto-generated Swagger UI
* `http://127.0.0.1:8000/api/meta`    — summary counts

---

## API

| Method | Path                                       | Returns |
| ------ | ------------------------------------------ | ------- |
| GET    | `/api/meta`                                | Summary counts |
| GET    | `/api/records`                             | All records. Optional filters: `gene`, `organism`, `model_cat`, `model_sub`, `tissue`, `q` (free text). All are case-insensitive substring matches. |
| GET    | `/api/records/{tpea_id}`                   | Single record bundled with all its evidence + diseases + variants. |
| GET    | `/api/genes`                               | Gene catalog |
| GET    | `/api/pain-models`                         | Pain model catalog |
| GET    | `/api/pain-types`                          | Pain type dictionary |
| GET    | `/api/tissues`                             | Source / tissue list |
| GET    | `/api/tissue-cell-catalog`                 | Cell-line catalog |
| GET    | `/api/evidence/sequencing?tpea_id=…`       | HTP evidence rows |
| GET    | `/api/evidence/expression?tpea_id=…`       | VDE evidence rows |
| GET    | `/api/evidence/perturbation?tpea_id=…`     | VP evidence rows |
| GET    | `/api/diseases?gene=…`                     | Disease associations |
| GET    | `/api/variants?gene=…`                     | Variants |
| POST   | `/api/admin/reload`                        | Re-read all CSVs from disk (handy after you edit data without `--reload`). |

### Examples

```bash
# All records for TRPV1 in mouse:
curl 'http://127.0.0.1:8000/api/records?gene=TRPV1&organism=Mouse'

# Single entry with bundled evidence:
curl http://127.0.0.1:8000/api/records/TPEA_00001 | jq .

# Free-text search:
curl 'http://127.0.0.1:8000/api/records?q=trigeminal'
```

---

## What does it serve?

It reads from `../data/*.csv` (the same files the front-end uses). When you
edit a CSV:

* If you launched with `--reload`, uvicorn auto-restarts on any file change
  in the working tree.
* Otherwise: `curl -X POST http://127.0.0.1:8000/api/admin/reload` to pick
  up the changes without restarting.

---

## Deploying it (if you ever want a public API)

Pick any free Python host. The minimal command they need is:

```
uvicorn app:app --host 0.0.0.0 --port $PORT
```

…and a build that runs `pip install -r requirements.txt`. The repo root
must be the working directory so the `../data/` lookup works (or change
`DATA_DIR` in `app.py` to an absolute path).
