"""
TPEA backend (optional, for local development)
==============================================

A small FastAPI server that reads the same CSV files in ../data/ and exposes
them as JSON. It also serves the static front-end (../) on the same port, so
you can hit a single URL and have the whole app working without anything else
running.

Why optional? The front-end already loads CSV directly via fetch(), so a real
backend isn't strictly necessary. Use this when you want:
  - Server-side filtering for large datasets
  - A REST surface you can hit from notebooks / scripts
  - A starting point for putting TPEA behind auth, a DB, etc.

Run:
    pip install -r requirements.txt
    uvicorn app:app --reload --port 8000

Then open http://127.0.0.1:8000/  (the front-end pages will be served directly).
The REST API lives under /api/*.

Endpoints
---------
  GET /api/records                 list all records (filter: gene, organism,
                                   model_cat, model_sub, tissue, q[free-text])
  GET /api/records/{tpea_id}       single record with bundled evidence
  GET /api/genes
  GET /api/pain-models
  GET /api/pain-types
  GET /api/tissues
  GET /api/tissue-cell-catalog
  GET /api/evidence/sequencing     (filter: tpea_id)
  GET /api/evidence/expression
  GET /api/evidence/perturbation
  GET /api/diseases                (filter: gene)
  GET /api/variants                (filter: gene)
  GET /api/meta                    summary counts
"""
from __future__ import annotations

import csv
from pathlib import Path
from typing import Any, Iterable, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BACKEND_DIR = Path(__file__).resolve().parent
REPO_ROOT   = BACKEND_DIR.parent
DATA_DIR    = REPO_ROOT / "data"

SPECIES_SCI = {
    "Human":  "Homo sapiens",
    "Mouse":  "Mus musculus",
    "Rat":    "Rattus norvegicus",
    "Others": "Canis familiaris",
}


# ---------------------------------------------------------------------------
# CSV loaders
# ---------------------------------------------------------------------------
def load_csv(name: str) -> list[dict[str, str]]:
    path = DATA_DIR / name
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as f:
        return [dict(row) for row in csv.DictReader(f)]


def to_int(v: Any, default: int = 0) -> int:
    try:
        return int(v) if v not in ("", None) else default
    except (TypeError, ValueError):
        return default


def to_float(v: Any, default: float = 0.0) -> float:
    try:
        return float(v) if v not in ("", None) else default
    except (TypeError, ValueError):
        return default


def normalize_records(rows: list[dict]) -> list[dict]:
    """Coerce numeric columns and fill organism_sci if missing."""
    out = []
    for r in rows:
        seq, expr, pert = to_int(r.get("seq")), to_int(r.get("expr")), to_int(r.get("pert"))
        conf = to_int(r.get("confidence")) if r.get("confidence") else seq + expr + pert
        out.append({
            "tpea_id":      r.get("tpea_id", ""),
            "gene":         r.get("gene", ""),
            "ensembl":      r.get("ensembl", ""),
            "organism":     r.get("organism", ""),
            "organism_sci": r.get("organism_sci") or SPECIES_SCI.get(r.get("organism", ""), r.get("organism", "")),
            "tissue":       r.get("tissue", ""),
            "model_cat":    r.get("model_cat", ""),
            "model_sub":    r.get("model_sub", ""),
            "seq": seq, "expr": expr, "pert": pert, "confidence": conf,
        })
    return out


def normalize_pain_models(rows: list[dict]) -> list[dict]:
    return [{
        "category":  r.get("category", ""),
        "sub":       r.get("sub", ""),
        "fullName":  r.get("full_name", ""),
        "species":   [s.strip() for s in (r.get("species") or "").split(";") if s.strip()],
        "desc":      r.get("description", ""),
        "reference": r.get("reference", ""),
        "pmid":      r.get("pmid", ""),
    } for r in rows]


# Load everything once at startup. For a long-running dev server, this means
# changes to CSV require a reload — uvicorn --reload handles that for us.
def load_all() -> dict[str, Any]:
    return {
        "records":           normalize_records(load_csv("records.csv")),
        "genes":             load_csv("genes.csv"),
        "pain_models":       normalize_pain_models(load_csv("pain_models.csv")),
        "pain_types":        load_csv("pain_types.csv"),
        "tissues":           [r["tissue"] for r in load_csv("tissues.csv") if r.get("tissue")],
        "tissue_cell":       load_csv("tissue_cell_catalog.csv"),
        "evidence_seq":      load_csv("evidence_sequencing.csv"),
        "evidence_expr":     load_csv("evidence_expression.csv"),
        "evidence_pert":     load_csv("evidence_perturbation.csv"),
        "diseases":          load_csv("diseases.csv"),
        "variants":          load_csv("variants.csv"),
    }


DATA = load_all()


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="TPEA API", version="1.0",
              description="REST view over the CSV-backed Pain Expression Atlas dataset.")

# Permissive CORS so a notebook or another front-end on a different port can hit us.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=False,
    allow_methods=["GET"], allow_headers=["*"],
)


def filtered(rows: Iterable[dict], **kwargs) -> list[dict]:
    """Return rows where every non-None kwarg matches (case-insensitive substring)."""
    out = []
    for r in rows:
        ok = True
        for k, v in kwargs.items():
            if v is None or v == "":
                continue
            cell = str(r.get(k, ""))
            if v.lower() not in cell.lower():
                ok = False
                break
        if ok:
            out.append(r)
    return out


# ---- meta ----------------------------------------------------------------
@app.get("/api/meta")
def meta():
    return {
        "records":             len(DATA["records"]),
        "genes":               len({r["gene"] for r in DATA["records"]}),
        "pain_models":         len(DATA["pain_models"]),
        "pain_types":          len(DATA["pain_types"]),
        "tissues":             len(DATA["tissues"]),
        "evidence_sequencing": len(DATA["evidence_seq"]),
        "evidence_expression": len(DATA["evidence_expr"]),
        "evidence_perturbation": len(DATA["evidence_pert"]),
    }


# ---- records -------------------------------------------------------------
@app.get("/api/records")
def list_records(
    gene:      Optional[str] = None,
    organism:  Optional[str] = None,
    model_cat: Optional[str] = None,
    model_sub: Optional[str] = None,
    tissue:    Optional[str] = None,
    q:         Optional[str] = Query(None, description="Free-text search across all string columns"),
):
    rows = DATA["records"]
    if q:
        ql = q.lower()
        rows = [r for r in rows if any(ql in str(v).lower() for v in r.values())]
    return filtered(rows, gene=gene, organism=organism,
                    model_cat=model_cat, model_sub=model_sub, tissue=tissue)


@app.get("/api/records/{tpea_id}")
def get_record(tpea_id: str):
    rec = next((r for r in DATA["records"] if r["tpea_id"] == tpea_id), None)
    if rec is None:
        raise HTTPException(status_code=404, detail=f"No record with id {tpea_id}")
    return {
        "record":             rec,
        "evidence_sequencing":  [r for r in DATA["evidence_seq"]  if r.get("tpea_id") == tpea_id],
        "evidence_expression":  [r for r in DATA["evidence_expr"] if r.get("tpea_id") == tpea_id],
        "evidence_perturbation":[r for r in DATA["evidence_pert"] if r.get("tpea_id") == tpea_id],
        "diseases":             [r for r in DATA["diseases"]      if r.get("gene") == rec["gene"]],
        "variants":             [r for r in DATA["variants"]      if r.get("gene") == rec["gene"]],
    }


# ---- catalogs ------------------------------------------------------------
@app.get("/api/genes")              # noqa: E302
def list_genes():               return DATA["genes"]
@app.get("/api/pain-models")
def list_pain_models():         return DATA["pain_models"]
@app.get("/api/pain-types")
def list_pain_types():          return DATA["pain_types"]
@app.get("/api/tissues")
def list_tissues():             return DATA["tissues"]
@app.get("/api/tissue-cell-catalog")
def list_tissue_cell():         return DATA["tissue_cell"]


# ---- evidence ------------------------------------------------------------
@app.get("/api/evidence/sequencing")
def evidence_seq(tpea_id: Optional[str] = None, gene: Optional[str] = None):
    return filtered(DATA["evidence_seq"], tpea_id=tpea_id, gene=gene)


@app.get("/api/evidence/expression")
def evidence_expr(tpea_id: Optional[str] = None, gene: Optional[str] = None):
    return filtered(DATA["evidence_expr"], tpea_id=tpea_id, gene=gene)


@app.get("/api/evidence/perturbation")
def evidence_pert(tpea_id: Optional[str] = None, gene: Optional[str] = None):
    return filtered(DATA["evidence_pert"], tpea_id=tpea_id, gene=gene)


# ---- diseases & variants -------------------------------------------------
@app.get("/api/diseases")
def diseases(gene: Optional[str] = None):
    return filtered(DATA["diseases"], gene=gene)


@app.get("/api/variants")
def variants(gene: Optional[str] = None):
    return filtered(DATA["variants"], gene=gene)


# ---- admin: reload from disk -------------------------------------------
@app.post("/api/admin/reload")
def reload_data():
    """Re-read all CSV files from disk. Useful while editing data/*.csv."""
    global DATA
    DATA = load_all()
    return meta()


# ---------------------------------------------------------------------------
# Serve the static front-end from REPO_ROOT (so http://localhost:8000/ works).
# Mount LAST so /api/* takes precedence.
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return FileResponse(REPO_ROOT / "index.html")


app.mount("/", StaticFiles(directory=str(REPO_ROOT), html=True), name="static")
