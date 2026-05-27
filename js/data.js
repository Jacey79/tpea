/* ================================================================
 * TPEA front-end data loader (CSV-backed)
 *
 * Replaces the old js/data.js. Instead of hard-coding records in JS,
 * we fetch the CSV files from /data/*.csv at page load. The shape of
 * the resulting window.TPEA_DATA object stays IDENTICAL to the old
 * version, so the rest of the front-end (browse / search / entry /
 * download / painmodel pages) keeps working unchanged — they just
 * need to `await window.TPEA_DATA_READY` before reading the data.
 *
 * Files loaded (relative to the page that includes this script):
 *
 *   data/records.csv               -- one row per TPEA entry
 *   data/genes.csv                 -- gene -> Ensembl IDs across species
 *   data/pain_models.csv           -- pain model catalog
 *   data/pain_types.csv            -- pain type + assessment
 *   data/tissues.csv               -- list of sources / tissues
 *   data/tissue_cell_catalog.csv   -- cell-line / tissue catalog
 *   data/evidence_sequencing.csv   -- HTP rows, keyed by tpea_id
 *   data/evidence_expression.csv   -- VDE rows, keyed by tpea_id
 *   data/evidence_perturbation.csv -- VP rows, keyed by tpea_id
 *   data/diseases.csv              -- gene -> disease associations
 *   data/variants.csv              -- gene -> variant rows
 *
 * Public API (back-compat):
 *
 *   window.TPEA_DATA          -- the populated catalog (filled in once
 *                                CSVs have loaded). Same shape as before.
 *   window.TPEA_DATA_READY    -- Promise<TPEA_DATA>. Resolves once all
 *                                CSVs are loaded. Pages MUST await this
 *                                before reading TPEA_DATA.
 * ================================================================ */
(function () {
  'use strict';

  /* ---------- Minimal RFC 4180 CSV parser ----------
   * Handles:
   *   - quoted fields with embedded commas / newlines / "" -> "
   *   - CRLF, LF, or CR line endings
   *   - empty cells
   * Returns array of objects keyed by the first (header) row.
   */
  function parseCsv(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // strip BOM
    const rows = [];
    let row = [];
    let cell = '';
    let i = 0;
    let inQuotes = false;
    const n = text.length;
    while (i < n) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        cell += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { row.push(cell); cell = ''; i++; continue; }
      if (c === '\r') { // CRLF or lone CR
        row.push(cell); rows.push(row); row = []; cell = '';
        i++; if (text[i] === '\n') i++; continue;
      }
      if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; continue; }
      cell += c; i++;
    }
    // flush trailing cell / row
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    // drop any fully-empty trailing rows
    while (rows.length && rows[rows.length - 1].every(v => v === '')) rows.pop();
    if (!rows.length) return [];
    const headers = rows[0].map(h => h.trim());
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const obj = {};
      for (let c = 0; c < headers.length; c++) obj[headers[c]] = rows[r][c] ?? '';
      out.push(obj);
    }
    return out;
  }

  /* ---------- helpers ---------- */
  function dataPath(name) {
    // Resolve relative to the current page so this works at the repo root
    // (e.g. https://user.github.io/repo/) and at custom deploy paths.
    return 'data/' + name;
  }
  async function fetchCsv(name) {
    const url = dataPath(name);
    let res;
    try { res = await fetch(url, { cache: 'no-store' }); }
    catch (err) { throw new Error('Failed to fetch ' + url + ': ' + err.message); }
    if (!res.ok) throw new Error('HTTP ' + res.status + ' fetching ' + url);
    return parseCsv(await res.text());
  }
  // Lenient integer parse: "" / null / "NA" -> 0
  function toInt(v) {
    if (v === '' || v == null) return 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }
  function toFloat(v) {
    if (v === '' || v == null) return 0;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }

  const SPECIES_SCI = {
    Human:  'Homo sapiens',
    Mouse:  'Mus musculus',
    Rat:    'Rattus norvegicus',
    Others: 'Canis familiaris',
  };
  function speciesSci(orgKey) { return SPECIES_SCI[orgKey] || orgKey; }

  /* ---------- main loader ---------- */
  async function loadAll() {
    /* Load every CSV in parallel. Each call resolves to an array of plain
       objects keyed by the file's CSV header row. */
    const [
      recordsRaw, genesRaw, painModelsRaw, painTypesRaw,
      tissuesRaw, tissueCatalogRaw,
      seqRaw, exprRaw, pertRaw,
      diseasesRaw, variantsRaw,
    ] = await Promise.all([
      fetchCsv('records.csv'),
      fetchCsv('genes.csv'),
      fetchCsv('pain_models.csv'),
      fetchCsv('pain_types.csv'),
      fetchCsv('tissues.csv'),
      fetchCsv('tissue_cell_catalog.csv'),
      fetchCsv('evidence_sequencing.csv').catch(() => []),
      fetchCsv('evidence_expression.csv').catch(() => []),
      fetchCsv('evidence_perturbation.csv').catch(() => []),
      fetchCsv('diseases.csv').catch(() => []),
      fetchCsv('variants.csv').catch(() => []),
    ]);

    /* ---- normalize records ----
       Coerce numeric columns and ensure organism_sci is populated even if
       the CSV omits it (we can always derive it from `organism`). */
    const records = recordsRaw.map(r => {
      const seq = toInt(r.seq), expr = toInt(r.expr), pert = toInt(r.pert);
      const conf = r.confidence !== '' && r.confidence != null
        ? toInt(r.confidence) : (seq + expr + pert);
      return {
        tpea_id:      r.tpea_id,
        gene:         r.gene,
        ensembl:      r.ensembl,
        organism:     r.organism,
        organism_sci: r.organism_sci || speciesSci(r.organism),
        tissue:       r.tissue,
        model_cat:    r.model_cat,
        model_sub:    r.model_sub,
        seq, expr, pert,
        confidence: conf,
      };
    });

    /* ---- normalize gene catalog ---- */
    const genes = genesRaw.map(g => ({
      symbol:    g.symbol,
      ensembl_h: g.ensembl_human || g.ensembl_h || '',
      ensembl_m: g.ensembl_mouse || g.ensembl_m || '',
      ensembl_r: g.ensembl_rat   || g.ensembl_r || '',
    }));

    /* ---- normalize pain models ----
       `species` is stored as semicolon-separated string in the CSV; split
       back to an array. */
    const painModels = painModelsRaw.map(m => ({
      category:  m.category,
      sub:       m.sub,
      fullName:  m.full_name,
      species:   (m.species || '').split(';').map(s => s.trim()).filter(Boolean),
      desc:      m.description || '',
      reference: m.reference || '',
      pmid:      m.pmid || '',
    }));

    /* ---- pain types ---- */
    const painTypes = painTypesRaw.map(p => ({
      type:       p.type,
      assessment: p.assessment,
      desc:       p.description,
    }));

    /* ---- tissues ---- */
    const tissues = tissuesRaw.map(t => t.tissue).filter(Boolean);

    /* ---- tissue / cell catalog ---- */
    const tissueCellCatalog = tissueCatalogRaw.map(t => ({
      new_name:     t.new_name,
      cell_type:    t.cell_type,
      tissue:       t.tissue,
      derived_from: t.derived_from,
    }));

    /* ---- evidence rows (indexed by tpea_id for fast lookup) ----
       Stored as Map<tpea_id, Array<row>>. */
    function indexByTpea(rows, normalize) {
      const map = new Map();
      rows.forEach(raw => {
        const r = normalize(raw);
        if (!r.tpea_id) return;
        if (!map.has(r.tpea_id)) map.set(r.tpea_id, []);
        map.get(r.tpea_id).push(r);
      });
      return map;
    }

    const seqIndex = indexByTpea(seqRaw, r => ({
      tpea_id:     r.tpea_id,
      analysis_id: r.analysis_id,
      gse:         r.gse,
      assay:       r.assay,
      tissue:      r.tissue,
      direction:   r.direction,
      log2fc:      toFloat(r.log2fc),
      pvalue:      toFloat(r.pvalue),
      adjp:        toFloat(r.adjp),
      disease:     r.disease || '',
      pmid:        r.pmid,
    }));

    const exprIndex = indexByTpea(exprRaw, r => ({
      tpea_id:               r.tpea_id,
      analysis_id:           r.analysis_id,
      level:                 r.level || 'Expression',
      gene:                  r.gene,
      pain_model_category:   r.pain_model_category,
      pain_model_sub:        r.pain_model_sub,
      source:                r.source,
      perturbation_site:     'NA',
      organism:              r.organism,
      expression_assessment: r.expression_assessment,
      pain_type:             'NA',
      pain_assessment:       'NA',
      perturbation:          'NA',
      perturbation_method:   'NA',
      method:                r.expression_assessment,   // legacy alias used by entry.html
      tissue:                r.source,                   // legacy alias
      direction:             r.direction,
      effect:                r.effect,
      disease:               r.disease,
      pmid:                  r.pmid,
    }));

    const pertIndex = indexByTpea(pertRaw, r => ({
      tpea_id:              r.tpea_id,
      analysis_id:          r.analysis_id,
      level:                r.level || 'Perturbation',
      gene:                 r.gene,
      pain_model_category:  r.pain_model_category,
      pain_model_sub:       r.pain_model_sub,
      source:               r.source,
      perturbation_site:    r.perturbation_site,
      organism:             r.organism,
      pain_type:            r.pain_type,
      pain_assessment:      r.pain_assessment,
      perturbation:         r.perturbation,
      perturbation_method:  r.perturbation_method,
      direction:            r.direction,
      effect:               r.effect,
      disease:              r.disease,
      pmid:                 r.pmid,
    }));

    /* ---- disease & variant rows (keyed by gene symbol) ---- */
    function indexByGene(rows, normalize) {
      const map = new Map();
      rows.forEach(raw => {
        const r = normalize(raw);
        if (!r.gene) return;
        if (!map.has(r.gene)) map.set(r.gene, []);
        map.get(r.gene).push(r);
      });
      return map;
    }
    const diseaseIndex = indexByGene(diseasesRaw, r => ({
      gene:    r.gene,
      disease: r.disease,
      source:  r.source,
      pmid:    r.pmid,
    }));
    const variantIndex = indexByGene(variantsRaw, r => ({
      gene:               r.gene,
      origin:             r.origin,
      genomic_location:   r.genomic_location,
      ref:                r.ref,
      alt:                r.alt,
      type:               r.type,
      dbsnp:              r.dbsnp,
      associated_disease: r.associated_disease,
      source:             r.source,
    }));

    /* ---- buildEvidence(rec) -----------------------------------------
       Original signature used by entry.html & download.html. Returns
       seqRows / exprRows / pertRows / diseaseRows / variantRows arrays.
       Now sourced 1:1 from the CSV indices above, so the same gene/entry
       always shows the same evidence (deterministic, unlike the old
       Math.random implementation). */
    function buildEvidence(rec) {
      return {
        seqRows:     (seqIndex.get(rec.tpea_id)  || []).slice(),
        exprRows:    (exprIndex.get(rec.tpea_id) || []).slice(),
        pertRows:    (pertIndex.get(rec.tpea_id) || []).slice(),
        diseaseRows: (diseaseIndex.get(rec.gene) || []).slice(),
        variantRows: (variantIndex.get(rec.gene) || []).slice(),
      };
    }

    /* ---- public catalog ---- */
    const catalog = {
      painModels,
      painTypes,
      tissues,
      genes,
      records,
      tissueCellCatalog,
      organisms: ['Human','Mouse','Rat','Others'],
      speciesSci,
      speciesSciList: ['Homo sapiens','Mus musculus','Rattus norvegicus','Canis familiaris'],
      painCategories: [...new Set(painModels.map(m => m.category))],
      evidenceTiers: [
        { key: 'pert', label: 'Validated perturbation',            short: 'VP',  shortAbbr: 'VP',  color: '#3492B2' },
        { key: 'expr', label: 'Validated differential expression', short: 'VDE', shortAbbr: 'VDE', color: '#58BBD1' },
        { key: 'seq',  label: 'High-throughput profiling',         short: 'HTP', shortAbbr: 'HTP', color: '#9ED17B' },
      ],
      evidenceColors: { seq: '#9ED17B', expr: '#58BBD1', pert: '#3492B2' },
      buildEvidence,
    };
    return catalog;
  }

  /* ---- expose ----
     TPEA_DATA_READY resolves once all CSVs are parsed. Pages must await it
     before touching window.TPEA_DATA. We also populate window.TPEA_DATA as
     soon as the promise resolves, so legacy synchronous reads (after the
     await) keep working unchanged. */
  window.TPEA_DATA_READY = loadAll().then(data => {
    window.TPEA_DATA = data;
    return data;
  }).catch(err => {
    console.error('[TPEA] Failed to load CSV data:', err);
    // Surface the error in the page so users see something actionable.
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.createElement('div');
      banner.style.cssText = 'background:#8D2E2C;color:#fff;padding:14px 20px;font:600 14px/1.5 system-ui;text-align:center;position:sticky;top:0;z-index:99999';
      banner.textContent = 'TPEA data failed to load: ' + err.message +
        ' — make sure you opened this page via http(s):// (not file://), and that the data/ folder is reachable.';
      document.body && document.body.prepend(banner);
    });
    throw err;
  });
})();
