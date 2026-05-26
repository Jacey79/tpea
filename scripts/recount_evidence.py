"""
recount_evidence.py
-------------------
Update the seq / expr / pert / confidence columns in data/records.csv based
on the actual number of rows matching each tpea_id in the three evidence
CSVs.

Use this whenever you've added or removed rows in data/evidence_*.csv
and want records.csv to reflect the new counts without manually updating
them.

Run from the repo root:

    python3 scripts/recount_evidence.py
"""
from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

EVIDENCE = {
    "seq":  DATA / "evidence_sequencing.csv",
    "expr": DATA / "evidence_expression.csv",
    "pert": DATA / "evidence_perturbation.csv",
}


def count_by_tpea(path: Path) -> Counter:
    """Count rows per tpea_id. Missing file → empty counter."""
    if not path.exists():
        return Counter()
    with path.open(encoding="utf-8") as f:
        return Counter(row["tpea_id"] for row in csv.DictReader(f) if row.get("tpea_id"))


def main() -> None:
    counts = {k: count_by_tpea(v) for k, v in EVIDENCE.items()}

    records_path = DATA / "records.csv"
    if not records_path.exists():
        raise SystemExit(f"records.csv not found at {records_path}")

    with records_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames or []

    # Make sure the required columns exist.
    for col in ("seq", "expr", "pert", "confidence"):
        if col not in fieldnames:
            fieldnames.append(col)

    changed = 0
    for row in rows:
        tid = row.get("tpea_id", "")
        new = {
            "seq":  counts["seq"].get(tid, 0),
            "expr": counts["expr"].get(tid, 0),
            "pert": counts["pert"].get(tid, 0),
        }
        new["confidence"] = new["seq"] + new["expr"] + new["pert"]
        for k, v in new.items():
            if str(row.get(k, "")) != str(v):
                changed += 1
                row[k] = str(v)

    with records_path.open("w", newline="", encoding="utf-8") as f:
        # lineterminator="\n" keeps git diffs clean across platforms; the
        # CSV files in this repo use LF.
        w = csv.DictWriter(f, fieldnames=fieldnames,
                           quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)

    print(f"Updated {records_path.relative_to(ROOT)}: {changed} cells changed across {len(rows)} rows.")
    print("Summary of counts read from evidence CSVs:")
    for k, c in counts.items():
        print(f"  {k:>5}: {sum(c.values())} total rows across {len(c)} entries")


if __name__ == "__main__":
    main()
