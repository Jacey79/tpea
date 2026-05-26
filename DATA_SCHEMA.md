# TPEA Data Schema

Every file lives in `data/`. All files are **comma-separated, UTF-8, with a
header row**. Empty fields are represented by an empty string (not "NA"
unless explicitly noted).

Quoting rules follow RFC 4180:
- Wrap a field in double quotes if it contains a comma, newline, or double quote.
- Inside a quoted field, escape `"` as `""`.

---

## `records.csv` — main TPEA entries

One row per TPEA entry. This is the primary table the site is built on.

| column          | type    | example                          | notes |
| --------------- | ------- | -------------------------------- | ----- |
| `tpea_id`       | string  | `TPEA_00001`                     | Unique. Convention `TPEA_NNNNN`, zero-padded to 5 digits. |
| `gene`          | string  | `TRPV1`                          | Must appear as `symbol` in `genes.csv`. |
| `ensembl`       | string  | `ENSMUSG00000005952`             | The Ensembl ID for this gene in this organism. Pick the matching column from `genes.csv`. |
| `organism`      | enum    | `Human` / `Mouse` / `Rat` / `Others` | Short key. `Others` covers any species not in the first three. |
| `organism_sci`  | string  | `Mus musculus`                   | Scientific name. If left empty, the loader derives it from `organism` (Human→*Homo sapiens*, Mouse→*Mus musculus*, Rat→*Rattus norvegicus*, Others→*Canis familiaris*). |
| `tissue`        | string  | `Dorsal root ganglion (DRG)`     | Should match a value in `tissues.csv`. |
| `model_cat`     | string  | `Neuropathic Pain Models`        | Must match a `category` in `pain_models.csv`. |
| `model_sub`     | string  | `CCI`                            | Must match a `sub` in `pain_models.csv`. |
| `seq`           | int     | `3`                              | Number of evidence rows in `evidence_sequencing.csv` for this entry. |
| `expr`          | int     | `4`                              | Number of evidence rows in `evidence_expression.csv` for this entry. |
| `pert`          | int     | `3`                              | Number of evidence rows in `evidence_perturbation.csv` for this entry. |
| `confidence`    | int     | `10`                             | Sum of the three above. If left empty, the loader will compute it. |

> The `seq`/`expr`/`pert` counts drive the home-page stats, the radar chart on
> entry pages, and the sorting on browse pages. Keep them in sync with the
> evidence CSVs.

---

## `genes.csv` — gene catalog

| column          | type   | example              | notes |
| --------------- | ------ | -------------------- | ----- |
| `symbol`        | string | `TRPV1`              | Unique. Use HGNC nomenclature. |
| `ensembl_human` | string | `ENSG00000196689`    | Human Ensembl ID. |
| `ensembl_mouse` | string | `ENSMUSG00000005952` | Mouse Ensembl ID. |
| `ensembl_rat`   | string | `ENSRNOG00000006543` | Rat Ensembl ID. |

If you add a new gene here, you can then reference it from `records.csv`.

---

## `pain_models.csv` — pain model catalog

| column        | type   | example                              | notes |
| ------------- | ------ | ------------------------------------ | ----- |
| `category`    | string | `Neuropathic Pain Models`            | One of seven: Neuropathic / Inflammatory / Visceral / Cancer / Central Sensitization / Incisional / Headache. |
| `sub`         | string | `CCI`                                | Short code (e.g. CCI, SNI, CFA). Used in `records.csv → model_sub`. |
| `full_name`   | string | `Chronic Constriction Injury`        | Long form for display. |
| `species`     | string | `Mouse;Rat`                          | Semicolon-separated list of species this model is established in. |
| `description` | string | `CCI is a well-established …`        | Free text; can be a paragraph. Wrap in `"..."` if it contains commas. |
| `reference`   | string | `Bennett GJ, Xie YK. … Pain. 1988;…` | Seminal reference citation. |
| `pmid`        | string | `2837713`                            | PubMed ID. |

---

## `pain_types.csv` — pain type dictionary

| column       | type   | example                                |
| ------------ | ------ | -------------------------------------- |
| `type`       | string | `Mechanical pain`                      |
| `assessment` | string | `Von Frey test`                        |
| `description`| string | `Graded monofilaments applied …`       |

Multiple assessments per type are fine — just repeat the `type` value on
each row.

---

## `tissues.csv` — source list

Single column:

| column   | example                       |
| -------- | ----------------------------- |
| `tissue` | `Dorsal root ganglion (DRG)`  |

These show up as filter options. The values used in `records.csv` should
match entries in this list (otherwise the filter dropdown won't include them).

---

## `tissue_cell_catalog.csv` — cell-line / tissue catalog

| column         | type   | example                                       |
| -------------- | ------ | --------------------------------------------- |
| `new_name`     | string | `DRG (whole)`                                 |
| `cell_type`    | string | `Dorsal root ganglion neurons (whole tissue)` |
| `tissue`       | string | `Dorsal root ganglion`                        |
| `derived_from` | string | `Lumbar DRG (L4-L6)`                          |

Used by the Download page's "Tissue / cell data" export. Optional —
the rest of the site works without it.

---

## `evidence_sequencing.csv` — HTP (High-throughput profiling)

One row per sequencing analysis. Linked to a TPEA entry by `tpea_id`.

| column        | type   | example                  | notes |
| ------------- | ------ | ------------------------ | ----- |
| `analysis_id` | string | `TPEA-S-00001-01`        | Unique. Convention `TPEA-S-<entry-no>-<seq-no>`. |
| `tpea_id`     | string | `TPEA_00001`             | Foreign key to `records.csv`. |
| `gse`         | string | `GSE123456`              | GEO accession (or other repository ID). |
| `assay`       | string | `RNA-Seq`                | `RNA-Seq` / `miRNA-Seq` / `Microarray` / `Bulk RNA-Seq` / … |
| `tissue`      | string | `Dorsal root ganglion (DRG)` | Where the assay was run. |
| `direction`   | enum   | `Up`                     | `Up` or `Down`. |
| `log2fc`      | float  | `2.45`                   | log₂ fold-change. |
| `pvalue`      | float  | `1.23e-08`               | Raw p-value (scientific notation OK). |
| `adjp`        | float  | `5.67e-06`               | Adjusted p-value. |
| `samples`     | string | `3 ctrl / 3 pain`        | Free-text. |
| `pmid`        | string | `31234567`               | Source publication PubMed ID. |

---

## `evidence_expression.csv` — VDE (Validated Differential Expression)

Hypothesis-driven RNA/protein-level confirmation.

| column                  | type   | example                                 |
| ----------------------- | ------ | --------------------------------------- |
| `analysis_id`           | string | `TPEA-E-00001-01`                       |
| `tpea_id`               | string | `TPEA_00001`                            |
| `level`                 | string | `Expression`                            |
| `gene`                  | string | `TRPV1`                                 |
| `pain_model_category`   | string | `Neuropathic Pain Models`               |
| `pain_model_sub`        | string | `CCI`                                   |
| `source`                | string | `Dorsal root ganglion (DRG)`            |
| `organism`              | string | `Mus musculus`                          |
| `expression_assessment` | string | `RT-qPCR`                               |
| `direction`             | enum   | `Up` / `Down`                           |
| `effect`                | string | `TRPV1 mRNA was significantly … (p<0.01).` |
| `disease`               | string | `Neuropathic pain`                      |
| `pmid`                  | string | `29876543`                              |

Allowed values for `expression_assessment` include `RT-qPCR`,
`Western blot`, `ELISA`, `Immunohistochemistry`, `Immunofluorescence`,
`Northern blot`, `FISH`, `Flow cytometry`. Other terms are accepted; the
UI just displays whatever you write.

---

## `evidence_perturbation.csv` — VP (Validated Perturbation)

Causal evidence (KO / KD / overexpression / inhibitor / agonist).

| column                  | type   | example                                            |
| ----------------------- | ------ | -------------------------------------------------- |
| `analysis_id`           | string | `TPEA-P-00001-01`                                  |
| `tpea_id`               | string | `TPEA_00001`                                       |
| `level`                 | string | `Perturbation`                                     |
| `gene`                  | string | `TRPV1`                                            |
| `pain_model_category`   | string | `Neuropathic Pain Models`                          |
| `pain_model_sub`        | string | `CCI`                                              |
| `source`                | string | `Dorsal root ganglion (DRG)`                       |
| `perturbation_site`     | string | `Systemic` / `Dorsal root ganglion (DRG)` / …       |
| `organism`              | string | `Mus musculus`                                     |
| `pain_type`             | string | `Thermal pain`                                     |
| `pain_assessment`       | string | `Hargreaves test`                                  |
| `perturbation`          | enum   | `Knockout` / `Knock down` / `Overexpress` / `Inhibitor` / `Agonist` |
| `perturbation_method`   | string | `CRISPR-Cas9` / `siRNA` / `Capsazepine` / …         |
| `direction`             | enum   | `Up` (gene drives pain) / `Down` (gene protects against pain). See note below. |
| `effect`                | string | `TRPV1 knockout significantly attenuated thermal hyperalgesia …` |
| `disease`               | string | `Neuropathic pain`                                 |
| `pmid`                  | string | `28765432`                                         |

**`direction` semantics**: across all three evidence tiers, `Up` means
*"the gene's expression direction and the pain phenotype direction agree"*
(e.g. higher expression coincides with more pain; or KO of the gene → less
pain). `Down` means they disagree.

The recommended `perturbation` → `perturbation_method` pairings are:

```
Overexpress  → Electroporation / Gene Gun / Liposomal Transfection /
               Viral-Mediated Transfection / CRISPRa
Knockout     → CRISPR-Cas9 / Cre-loxP
Knock down   → siRNA / shRNA / ASO / CRISPRi
Inhibitor    → Neutralizing antibody / SB225002 / A-803467 / Capsazepine /
               HC-030031 / (any other small-molecule antagonist)
Agonist      → Capsaicin / AITC / SR141716A / (any other agonist)
```

---

## `diseases.csv` — gene → disease associations

| column    | type   | example                |
| --------- | ------ | ---------------------- |
| `gene`    | string | `TRPV1`                |
| `disease` | string | `Neuropathic Pain`     |
| `source`  | string | `DisGeNET:C0027796`    |
| `pmid`    | string | `23456789`             |

Multiple rows per gene are fine and expected.

---

## `variants.csv` — gene-associated variants

| column               | type   | example                |
| -------------------- | ------ | ---------------------- |
| `gene`               | string | `TRPV1`                |
| `origin`             | enum   | `germline` / `somatic` |
| `genomic_location`   | string | `chr17:3,475,283(+)`   |
| `ref`                | string | `G`                    |
| `alt`                | string | `A`                    |
| `type`               | enum   | `SNV` / `InDel`        |
| `dbsnp`              | string | `rs8065080`            |
| `associated_disease` | string | `Neuropathic Pain`     |
| `source`             | string | `ClinVar`              |
