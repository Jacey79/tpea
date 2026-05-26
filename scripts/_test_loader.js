/* End-to-end sanity check: feed the front-end data.js to a tiny browser
   shim, give it a Node fs-backed fetch, and verify the resulting
   window.TPEA_DATA looks right. */
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const REPO = path.resolve(__dirname, '..');

const shim = {
  window: {},
  document: {
    addEventListener() {},
    body: { prepend() {} },
    createElement: () => ({ style: { cssText: '' } }),
  },
  fetch: async (url) => {
    const p = path.join(REPO, url.replace(/^\/+/, ''));
    if (!fs.existsSync(p)) return { ok: false, status: 404 };
    const txt = fs.readFileSync(p, 'utf8');
    return { ok: true, status: 200, async text() { return txt; } };
  },
  console,
};
shim.window = shim;
shim.globalThis = shim;
vm.createContext(shim);

const src = fs.readFileSync(path.join(REPO, 'js/data.js'), 'utf8');
vm.runInContext(src, shim);

(async () => {
  const D = await shim.window.TPEA_DATA_READY;
  console.log('records:',           D.records.length,  '   first:', D.records[0]);
  console.log('genes:',             D.genes.length);
  console.log('painModels:',        D.painModels.length, '  sample:', D.painModels[0].sub, '-', D.painModels[0].fullName);
  console.log('painTypes:',         D.painTypes.length);
  console.log('tissues:',           D.tissues.length);
  console.log('tissueCellCatalog:', D.tissueCellCatalog.length);
  console.log('painCategories:',    D.painCategories);
  const ev = D.buildEvidence(D.records[0]);
  console.log('evidence(TPEA_00001):',
    { seq: ev.seqRows.length, expr: ev.exprRows.length, pert: ev.pertRows.length,
      dis: ev.diseaseRows.length, var: ev.variantRows.length });
  console.log('OK');
})().catch(e => { console.error('FAIL:', e); process.exit(1); });
