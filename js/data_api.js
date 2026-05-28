(function () {
  'use strict';

  const API = 'https://tpea.136084963.workers.dev';

  function parseCsv(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = [];
    let row = [], cell = '', i = 0, inQuotes = false;
    const n = text.length;
    while (i < n) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i+1] === '"') { cell += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        cell += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { row.push(cell); cell = ''; i++; continue; }
      if (c === '\r') { row.push(cell); rows.push(row); row = []; cell = ''; i++; if (text[i] === '\n') i++; continue; }
      if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; continue; }
      cell += c; i++;
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    while (rows.length && rows[rows.length-1].every(v => v === '')) rows.pop();
    if (!rows.length) return [];
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i] ?? '');
      return obj;
    });
  }

  async function fetchCsv(name) {
    const res = await fetch('data/' + name, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' fetching ' + name);
    return parseCsv(await res.text());
  }

  async function fetchAllRecords() {
    const pageSize = 1000;
    let page = 1, all = [];
    while (true) {
      const res = await fetch(`${API}/api/records?limit=${pageSize}&page=${page}`);
      const json = await res.json();
      all = all.concat(json.data);
      if (all.length >= json.total) break;
      page++;
    }
    return all;
  }

  function toInt(v) { if (v === '' || v == null) return 0; const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; }
  function toFloat(v) { if (v === '' || v == null) return 0; const n = parseFloat(v); return Number.isFinite(n) ? n : 0; }

  const SPECIES_SCI = { Human: 'Homo sapiens', Mouse: 'Mus musculus', Rat: 'Rattus norvegicus', Others: 'Canis familiaris' };
  function speciesSci(orgKey) { return SPECIES_SCI[orgKey] || orgKey; }

  async function loadAll() {
    const [
      recordsRaw, genesRaw, painModelsRaw, painTypesRaw,
      tissuesRaw, tissueCatalogRaw,
      exprRaw, pertRaw, diseasesRaw, variantsRaw,
    ] = await Promise.all([
      fetchAllRecords(),
      fetchCsv('genes.csv'),
      fetchCsv('pain_models.csv'),
      fetchCsv('pain_types.csv'),
      fetchCsv('tissues.csv'),
      fetchCsv('tissue_cell_catalog.csv'),
      fetchCsv('evidence_expression.csv').catch(() => []),
      fetchCsv('evidence_perturbation.csv').catch(() => []),
      fetchCsv('diseases.csv').catch(() => []),
      fetchCsv('variants.csv').catch(() => []),
    ]);

    const records = recordsRaw.map(r => ({
      tpea_id:      r.tpea_id,
      gene:         r.gene,
      ensembl:      r.ensembl,
      organism:     r.organism,
      organism_sci: r.organism_sci || speciesSci(r.organism),
      tissue:       r.tissue,
      model_cat:    r.model_cat,
      model_sub:    r.model_sub,
      seq:          toInt(r.seq),
      expr:         toInt(r.expr),
      pert:         toInt(r.pert),
      confidence:   toInt(r.confidence),
    }));

    const genes = genesRaw.map(g => ({
      symbol: g.symbol,
      ensembl_h: g.ensembl_human || g.ensembl_h || '',
      ensembl_m: g.ensembl_mouse || g.ensembl_m || '',
      ensembl_r: g.ensembl_rat   || g.ensembl_r || '',
    }));

    const painModels = painModelsRaw.map(m => ({
      category: m.category, sub: m.sub, fullName: m.full_name,
      species: (m.species || '').split(';').map(s => s.trim()).filter(Boolean),
      desc: m.description || '', reference: m.reference || '', pmid: m.pmid || '',
    }));

    const painTypes = painTypesRaw.map(p => ({ type: p.type, assessment: p.assessment, desc: p.description }));
    const tissues = tissuesRaw.map(t => t.tissue).filter(Boolean);
    const tissueCellCatalog = tissueCatalogRaw.map(t => ({
      new_name: t.new_name, cell_type: t.cell_type, tissue: t.tissue, derived_from: t.derived_from,
    }));

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

    const exprIndex = indexByTpea(exprRaw, r => ({
      tpea_id: r.tpea_id, analysis_id: r.analysis_id,
      level: r.level || 'Expression', gene: r.gene,
      pain_model_category: r.pain_model_category, pain_model_sub: r.pain_model_sub,
      source: r.source, perturbation_site: 'NA', organism: r.organism,
      expression_assessment: r.expression_assessment,
      pain_type: 'NA', pain_assessment: 'NA', perturbation: 'NA', perturbation_method: 'NA',
      method: r.expression_assessment, tissue: r.source,
      direction: r.direction, effect: r.effect, disease: r.disease, pmid: r.pmid,
    }));

    const pertIndex = indexByTpea(pertRaw, r => ({
      tpea_id: r.tpea_id, analysis_id: r.analysis_id,
      level: r.level || 'Perturbation', gene: r.gene,
      pain_model_category: r.pain_model_category, pain_model_sub: r.pain_model_sub,
      source: r.source, perturbation_site: r.perturbation_site, organism: r.organism,
      pain_type: r.pain_type, pain_assessment: r.pain_assessment,
      perturbation: r.perturbation, perturbation_method: r.perturbation_method,
      direction: r.direction, effect: r.effect, disease: r.disease, pmid: r.pmid,
    }));

    const diseaseIndex = indexByGene(diseasesRaw, r => ({ gene: r.gene, disease: r.disease, source: r.source, pmid: r.pmid }));
    const variantIndex = indexByGene(variantsRaw, r => ({
      gene: r.gene, origin: r.origin, genomic_location: r.genomic_location,
      ref: r.ref, alt: r.alt, type: r.type, dbsnp: r.dbsnp,
      associated_disease: r.associated_disease, source: r.source,
    }));

    const seqCache = new Map();
    async function getSeqRows(tpea_id) {
      if (seqCache.has(tpea_id)) return seqCache.get(tpea_id);
      const res = await fetch(`${API}/api/evidence?tpea_id=${tpea_id}`);
      const json = await res.json();
      const rows = (json.data || []).map(r => ({
        tpea_id: r.tpea_id, analysis_id: r.analysis_id,
        gse: r.gse, assay: r.assay, tissue: r.tissue,
        direction: r.direction, log2fc: toFloat(r.log2fc),
        pvalue: toFloat(r.pvalue), adjp: toFloat(r.adjp),
        disease: r.disease || '', pmid: r.pmid,
      }));
      seqCache.set(tpea_id, rows);
      return rows;
    }

    async function buildEvidence(rec) {
      const seqRows = await getSeqRows(rec.tpea_id);
      return {
        seqRows,
        exprRows:    (exprIndex.get(rec.tpea_id)  || []).slice(),
        pertRows:    (pertIndex.get(rec.tpea_id)  || []).slice(),
        diseaseRows: (diseaseIndex.get(rec.gene)  || []).slice(),
        variantRows: (variantIndex.get(rec.gene)  || []).slice(),
      };
    }

    return {
      painModels, painTypes, tissues, genes, records, tissueCellCatalog,
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
  }

  window.TPEA_DATA_READY = loadAll().then(data => {
    window.TPEA_DATA = data;
    return data;
  }).catch(err => {
    console.error('[TPEA] Failed to load data:', err);
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.createElement('div');
      banner.style.cssText = 'background:#8D2E2C;color:#fff;padding:14px 20px;font:600 14px/1.5 system-ui;text-align:center;position:sticky;top:0;z-index:99999';
      banner.textContent = 'TPEA data failed to load: ' + err.message;
      document.body && document.body.prepend(banner);
    });
    throw err;
  });
})();
