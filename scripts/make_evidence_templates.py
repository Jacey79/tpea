"""
Generates EMPTY template CSV files for the three evidence tables and
the two ancillary tables (diseases, variants).

Each file contains:
  - row 1: header
  - rows 2..N: a small number of EXAMPLE rows showing the format

You can simply append your real rows below the examples, or delete
the example rows and start from a clean slate.

Run:
  python3 scripts/make_evidence_templates.py
"""
import csv
import os
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)


def write(name, headers, examples):
    """Write a CSV file with header + example rows (RFC 4180 / Excel-friendly)."""
    p = DATA_DIR / name
    with p.open("w", newline="", encoding="utf-8") as f:
        # lineterminator="\n" keeps git diffs clean and matches the other CSVs in this repo.
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
        w.writerow(headers)
        for row in examples:
            w.writerow([row.get(h, "") for h in headers])
    print(f"  wrote {name}  (header + {len(examples)} example row(s))")


# ---------------------------------------------------------------------------
# evidence_sequencing.csv  --  High-throughput profiling (HTP / seq)
# ---------------------------------------------------------------------------
seq_headers = [
    "analysis_id", "tpea_id", "gse", "assay", "tissue",
    "direction", "log2fc", "pvalue", "adjp", "samples", "pmid",
]
seq_examples = [
    {
        "analysis_id": "TPEA-S-00001-01",
        "tpea_id":     "TPEA_00001",
        "gse":         "GSE123456",
        "assay":       "RNA-Seq",
        "tissue":      "Dorsal root ganglion (DRG)",
        "direction":   "Up",
        "log2fc":      "2.45",
        "pvalue":      "1.23e-08",
        "adjp":        "5.67e-06",
        "samples":     "3 ctrl / 3 pain",
        "pmid":        "31234567",
    },
    {
        "analysis_id": "TPEA-S-00001-02",
        "tpea_id":     "TPEA_00001",
        "gse":         "GSE234567",
        "assay":       "Microarray",
        "tissue":      "Dorsal root ganglion (DRG)",
        "direction":   "Up",
        "log2fc":      "1.78",
        "pvalue":      "4.5e-07",
        "adjp":        "2.1e-05",
        "samples":     "4 ctrl / 4 pain",
        "pmid":        "30123456",
    },
]
write("evidence_sequencing.csv", seq_headers, seq_examples)


# ---------------------------------------------------------------------------
# evidence_expression.csv  --  Validated differential expression (VDE / expr)
# ---------------------------------------------------------------------------
expr_headers = [
    "analysis_id", "tpea_id", "level", "gene",
    "pain_model_category", "pain_model_sub",
    "source",                # tissue / cell where expression was measured
    "organism",              # scientific name e.g. "Mus musculus"
    "expression_assessment", # RT-qPCR / Western blot / IHC / IF / ELISA / ...
    "direction",             # Up | Down
    "effect",                # free-text mechanistic summary
    "disease",
    "pmid",
]
expr_examples = [
    {
        "analysis_id":           "TPEA-E-00001-01",
        "tpea_id":               "TPEA_00001",
        "level":                 "Expression",
        "gene":                  "TRPV1",
        "pain_model_category":   "Neuropathic Pain Models",
        "pain_model_sub":        "CCI",
        "source":                "Dorsal root ganglion (DRG)",
        "organism":              "Mus musculus",
        "expression_assessment": "RT-qPCR",
        "direction":             "Up",
        "effect":                "TRPV1 mRNA was significantly upregulated in DRG ipsilateral to CCI vs sham (p<0.01).",
        "disease":               "Neuropathic pain",
        "pmid":                  "29876543",
    },
]
write("evidence_expression.csv", expr_headers, expr_examples)


# ---------------------------------------------------------------------------
# evidence_perturbation.csv  --  Validated perturbation (VP / pert)
# ---------------------------------------------------------------------------
pert_headers = [
    "analysis_id", "tpea_id", "level", "gene",
    "pain_model_category", "pain_model_sub",
    "source",               # tissue / cell where perturbation success was confirmed
    "perturbation_site",    # injection / processing site (or "Systemic")
    "organism",
    "pain_type",            # Mechanical pain / Thermal pain / ...
    "pain_assessment",      # Von Frey test / Hargreaves test / ...
    "perturbation",         # Overexpress / Knockout / Knock down / Inhibitor / Agonist
    "perturbation_method",  # CRISPR-Cas9 / siRNA / Capsazepine / ...
    "direction",            # Up = consistent (gene drives pain) | Down = opposite
    "effect",
    "disease",
    "pmid",
]
pert_examples = [
    {
        "analysis_id":          "TPEA-P-00001-01",
        "tpea_id":              "TPEA_00001",
        "level":                "Perturbation",
        "gene":                 "TRPV1",
        "pain_model_category":  "Neuropathic Pain Models",
        "pain_model_sub":       "CCI",
        "source":               "Dorsal root ganglion (DRG)",
        "perturbation_site":    "Systemic",
        "organism":             "Mus musculus",
        "pain_type":            "Thermal pain",
        "pain_assessment":      "Hargreaves test",
        "perturbation":         "Knockout",
        "perturbation_method":  "CRISPR-Cas9",
        "direction":            "Up",
        "effect":               "TRPV1 knockout significantly attenuated thermal hyperalgesia in the CCI model.",
        "disease":              "Neuropathic pain",
        "pmid":                 "28765432",
    },
]
write("evidence_perturbation.csv", pert_headers, pert_examples)


# ---------------------------------------------------------------------------
# diseases.csv  --  gene -> disease associations
# ---------------------------------------------------------------------------
disease_headers = ["gene", "disease", "source", "pmid"]
disease_examples = [
    {"gene": "TRPV1", "disease": "Neuropathic Pain",      "source": "DisGeNET:C0027796", "pmid": "23456789"},
    {"gene": "TRPV1", "disease": "Inflammatory Pain",     "source": "DisGeNET:C2937257", "pmid": "27345678"},
]
write("diseases.csv", disease_headers, disease_examples)


# ---------------------------------------------------------------------------
# variants.csv  --  gene-associated variants
# ---------------------------------------------------------------------------
variant_headers = [
    "gene", "origin", "genomic_location", "ref", "alt", "type",
    "dbsnp", "associated_disease", "source",
]
variant_examples = [
    {
        "gene":               "TRPV1",
        "origin":             "germline",
        "genomic_location":   "chr17:3,475,283(+)",
        "ref":                "G",
        "alt":                "A",
        "type":               "SNV",
        "dbsnp":              "rs8065080",
        "associated_disease": "Neuropathic Pain",
        "source":             "ClinVar",
    },
]
write("variants.csv", variant_headers, variant_examples)

print("Done.")
