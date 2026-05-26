/* ============================================================
 * export_main_data_to_csv.js
 *
 * One-time migration script.
 * Loads the original front-end data.js (no fetch / no DOM needed)
 * and dumps the four "ground-truth" tables to CSV:
 *
 *   data/records.csv               -> per-TPEA-entry header info
 *   data/genes.csv                 -> gene symbol + Ensembl IDs
 *   data/pain_models.csv           -> pain model catalog
 *   data/pain_types.csv            -> pain type + assessment
 *   data/tissues.csv               -> tissue list (one column)
 *   data/tissue_cell_catalog.csv   -> cell-line / tissue catalog
 *
 * The three "evidence" tables (sequencing / expression / perturbation)
 * are intentionally left as empty templates for the user to fill in
 * by hand. See data/evidence_*.csv (created separately).
 *
 * Run:
 *   node scripts/export_main_data_to_csv.js path/to/old/data.js
 * ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const srcPath = process.argv[2] || path.join(__dirname, '..', 'js', 'data.original.js');
const outDir  = path.join(__dirname, '..', 'data');
if (!fs.existsSync(srcPath)) {
  console.error('Source data.js not found:', srcPath);
  process.exit(1);
}
const src = fs.readFileSync(srcPath, 'utf8');

// Fake browser window so the original data.js can assign to window.TPEA_DATA.
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: srcPath });
const D = sandbox.window.TPEA_DATA;
if (!D) { console.error('window.TPEA_DATA not produced by source file'); process.exit(1); }

/* ---------- tiny CSV writer (RFC 4180) ---------- */
function csvCell(v) {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (/[",\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}
function writeCsv(filename, headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h => csvCell(r[h])).join(',')));
  const full = path.join(outDir, filename);
  fs.writeFileSync(full, lines.join('\n') + '\n', 'utf8');
  console.log(`  wrote ${filename}  (${rows.length} rows)`);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
console.log('Exporting main data → CSV:');

/* ---------- records.csv ----------
 * Header columns are the keys the front-end expects on each record.
 * organism_sci is the Latin scientific name; organism is the short key. */
writeCsv('records.csv',
  ['tpea_id','gene','ensembl','organism','organism_sci','tissue',
   'model_cat','model_sub','seq','expr','pert','confidence'],
  D.records);

/* ---------- genes.csv ----------
 * One row per gene symbol with Ensembl IDs in three species columns. */
writeCsv('genes.csv',
  ['symbol','ensembl_human','ensembl_mouse','ensembl_rat'],
  D.genes.map(g => ({
    symbol: g.symbol,
    ensembl_human: g.ensembl_h,
    ensembl_mouse: g.ensembl_m,
    ensembl_rat:   g.ensembl_r,
  })));

/* ---------- pain_models.csv ----------
 * species is multi-value (semicolon-separated). Keep description on one
 * line so spreadsheet editors handle it cleanly. */
writeCsv('pain_models.csv',
  ['category','sub','full_name','species','description','reference','pmid'],
  D.painModels.map(m => ({
    category:    m.category,
    sub:         m.sub,
    full_name:   m.fullName,
    species:     m.species.join(';'),
    description: (m.desc || '').replace(/\s+/g, ' ').trim(),
    reference:   m.reference || '',
    pmid:        m.pmid || '',
  })));

/* ---------- pain_types.csv ---------- */
writeCsv('pain_types.csv',
  ['type','assessment','description'],
  D.painTypes.map(p => ({
    type:        p.type,
    assessment:  p.assessment,
    description: p.desc,
  })));

/* ---------- tissues.csv ----------
 * Single column. We dump it as CSV with header so the loader is uniform. */
writeCsv('tissues.csv',
  ['tissue'],
  D.tissues.map(t => ({ tissue: t })));

/* ---------- tissue_cell_catalog.csv ---------- */
writeCsv('tissue_cell_catalog.csv',
  ['new_name','cell_type','tissue','derived_from'],
  D.tissueCellCatalog);

console.log('Done.');
