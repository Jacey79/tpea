/* ================================================================
   TPEA mock dataset (v2 — matches spec)
   Pain categories: 7 (Neuropathic / Inflammatory / Visceral / Cancer
                     / Central Sensitization / Incisional / Headache)
   Organisms: Human / Mouse / Rat / Others
   Evidence: Sequencing | Expression | Perturbation
   ================================================================ */

/* ---------- Pain models ---------- */
const PAIN_MODELS = [
  // Neuropathic
  { category: 'Neuropathic Pain Models', sub: 'CCI', fullName: 'Chronic Constriction Injury',
    species: ['Mouse','Rat'],
    desc: "CCI (Chronic Constriction Injury) is a well-established neuropathic pain model in which the site of injury is the common sciatic nerve (mid-thigh level). The procedure involves loosely ligating the sciatic nerve with four chromic gut sutures (typically 4-0), creating a chronic constriction that leads to partial nerve compression and subsequent inflammation, Wallerian degeneration, and pain-related behaviours. This model is widely applied to study the mechanisms of peripheral neuropathic pain, such as thermal hyperalgesia and mechanical allodynia, and to evaluate potential analgesic compounds.",
    reference: 'Bennett GJ, Xie YK. A peripheral mononeuropathy in rat that produces disorders of pain sensation like those seen in man. Pain. 1988;33(1):87-107.',
    pmid: '2837713' },
  { category: 'Neuropathic Pain Models', sub: 'SNI', fullName: 'Spared Nerve Injury',
    species: ['Mouse','Rat'],
    desc: "The Spared Nerve Injury (SNI) model involves ligating and transecting two of the three terminal branches of the sciatic nerve (the tibial and common peroneal), while leaving the sural nerve intact. This produces robust, long-lasting mechanical and cold allodynia confined to the sural territory, offering a highly reproducible model of peripheral neuropathic pain.",
    reference: 'Decosterd I, Woolf CJ. Spared nerve injury: an animal model of persistent peripheral neuropathic pain. Pain. 2000;87(2):149-158.',
    pmid: '10924808' },
  { category: 'Neuropathic Pain Models', sub: 'SNL', fullName: 'Spinal Nerve Ligation',
    species: ['Rat','Mouse'],
    desc: "Spinal Nerve Ligation (SNL) selectively ligates the L5 (and sometimes L6) spinal nerves distal to the dorsal root ganglion, producing mechanical allodynia and thermal hyperalgesia restricted to the paw ipsilateral to the injury. SNL is widely used for screening analgesics because of its strong and reproducible behavioral phenotype.",
    reference: 'Kim SH, Chung JM. An experimental model for peripheral neuropathy produced by segmental spinal nerve ligation in the rat. Pain. 1992;50(3):355-363.',
    pmid: '1333581' },
  { category: 'Neuropathic Pain Models', sub: 'DPN', fullName: 'Diabetic Peripheral Neuropathy',
    species: ['Human','Mouse','Rat'],
    desc: "Diabetic Peripheral Neuropathy is modeled by streptozotocin (STZ) injection, which induces β-cell destruction and hyperglycemia, leading to sensory neuropathy with mechanical and thermal hypersensitivity that recapitulates features of human diabetic painful neuropathy.",
    reference: 'Sullivan KA et al. Mouse models of diabetic neuropathy. Neurobiol Dis. 2007;28(3):276-285.',
    pmid: '17804252' },
  { category: 'Neuropathic Pain Models', sub: 'CIPN', fullName: 'Chemotherapy-Induced Peripheral Neuropathy',
    species: ['Human','Mouse','Rat'],
    desc: "Chemotherapy-Induced Peripheral Neuropathy (CIPN) is induced by systemic administration of chemotherapeutics (paclitaxel, oxaliplatin, vincristine, bortezomib), producing dose-dependent sensory neuropathy. Mechanical allodynia and cold hyperalgesia are the hallmark behavioral outcomes.",
    reference: 'Polomano RC et al. A painful peripheral neuropathy in the rat produced by the chemotherapeutic drug, paclitaxel. Pain. 2001;94(3):293-304.',
    pmid: '11731065' },

  // Inflammatory
  { category: 'Inflammatory Pain Models', sub: 'CFA', fullName: "Complete Freund's Adjuvant",
    species: ['Mouse','Rat'],
    desc: "Intraplantar injection of Complete Freund's Adjuvant (CFA, heat-killed Mycobacterium tuberculosis in oil emulsion) induces robust peripheral inflammation. Hindpaw edema, erythema, and mechanical/thermal hypersensitivity develop within hours and persist for several weeks, closely mimicking chronic inflammatory pain.",
    reference: 'Stein C et al. Unilateral inflammation of the hindpaw in rats as a model of prolonged noxious stimulation. Pharmacol Biochem Behav. 1988;31(2):451-455.',
    pmid: '3244721' },
  { category: 'Inflammatory Pain Models', sub: 'Carrageenan', fullName: 'Carrageenan-Induced Inflammation',
    species: ['Mouse','Rat'],
    desc: "Intraplantar λ-carrageenan induces acute edema and hyperalgesia via cytokine release, complement activation and neutrophil infiltration. The hypersensitivity develops within 1–2 h, peaks at 3–4 h and resolves over 24–72 h, making it a staple acute inflammation model.",
    reference: 'Winter CA et al. Carrageenin-induced edema in hind paw of the rat as an assay for antiinflammatory drugs. Proc Soc Exp Biol Med. 1962;111:544-547.',
    pmid: '14001233' },
  { category: 'Inflammatory Pain Models', sub: 'MSU', fullName: 'Monosodium Urate Crystals (Gout)',
    species: ['Mouse','Rat'],
    desc: "Monosodium Urate (MSU) crystal injection into the ankle or paw models acute gouty arthritis. MSU crystals activate the NLRP3 inflammasome in resident macrophages, triggering IL-1β-driven inflammation, neutrophil influx and mechanical hypersensitivity.",
    reference: 'Martin WJ et al. Monosodium urate monohydrate crystal-recruited non-inflammatory monocytes differentiate into M1-like pro-inflammatory macrophages. Arthritis Rheum. 2011;63(5):1322-1332.',
    pmid: '21305523' },
  { category: 'Inflammatory Pain Models', sub: 'Formalin', fullName: 'Formalin Test',
    species: ['Mouse','Rat'],
    desc: "Subcutaneous formalin injection produces a characteristic biphasic nociceptive response: an acute phase (0–5 min) driven by direct TRPA1 activation on nociceptors, and a tonic phase (15–60 min) driven by central sensitization. Used to assess both peripheral and central components of analgesia.",
    reference: 'Dubuisson D, Dennis SG. The formalin test: a quantitative study of the analgesic effects of morphine, meperidine, and brain stem stimulation in rats and cats. Pain. 1977;4(2):161-174.',
    pmid: '564014' },

  // Visceral
  { category: 'Visceral Pain Models', sub: 'IBS', fullName: 'Irritable Bowel Syndrome-like Visceral Hypersensitivity',
    species: ['Human','Mouse','Rat'],
    desc: "Visceral hypersensitivity modeling IBS is commonly induced by neonatal maternal separation, colonic TNBS/DSS instillation, or acetic acid irritation. Visceromotor response to colorectal distension is the gold-standard behavioral readout.",
    reference: 'Al-Chaer ED et al. A new model of chronic visceral hypersensitivity in adult rats induced by colon irritation during postnatal development. Gastroenterology. 2000;119(5):1276-1285.',
    pmid: '11054385' },
  { category: 'Visceral Pain Models', sub: 'Endometriosis', fullName: 'Endometriosis-associated Pain',
    species: ['Human','Mouse','Rat'],
    desc: "Autologous or syngeneic transplantation of endometrial tissue into the peritoneum produces ectopic lesions that recapitulate endometriosis-associated chronic pelvic pain. Pain is assessed through vaginal hyperalgesia and abdominal mechanical sensitivity.",
    reference: 'Greaves E et al. A novel mouse model of endometriosis mimics human disease phenotypes. Am J Pathol. 2014;184(7):1930-1939.',
    pmid: '24910298' },

  // Cancer
  { category: 'Cancer Pain Models', sub: 'BCP', fullName: 'Bone Cancer Pain',
    species: ['Mouse','Rat'],
    desc: "Bone Cancer Pain (BCP) is induced by intratibial or intrafemoral inoculation of syngeneic osteolytic tumor cells (4T1, NCTC-2472, MRMT-1). Progressive bone destruction produces sustained spontaneous pain, mechanical allodynia, and movement-evoked pain that recapitulate clinical bone-metastasis pain.",
    reference: 'Schwei MJ et al. Neurochemical and cellular reorganization of the spinal cord in a murine model of bone cancer pain. J Neurosci. 1999;19(24):10886-10897.',
    pmid: '10594070' },

  // Central sensitization
  { category: 'Central Sensitization Models', sub: 'Capsaicin', fullName: 'Capsaicin-Induced Central Sensitization',
    species: ['Human','Mouse','Rat'],
    desc: "Intradermal or intraplantar capsaicin rapidly induces central sensitization via TRPV1 activation on primary afferents. Results in a characteristic zone of secondary mechanical hyperalgesia and allodynia around the injection site.",
    reference: 'LaMotte RH et al. Neurogenic hyperalgesia: psychophysical studies of underlying mechanisms. J Neurophysiol. 1991;66(1):190-211.',
    pmid: '1919666' },
  { category: 'Central Sensitization Models', sub: 'NMDA', fullName: 'NMDA-Induced Central Sensitization',
    species: ['Mouse','Rat'],
    desc: "Intrathecal NMDA produces a rapid-onset, dose-dependent hyperalgesia and biting/licking behavior, directly activating central glutamatergic sensitization mechanisms downstream of primary afferent input.",
    reference: 'Aanonsen LM et al. Nociceptive action of excitatory amino acids in the mouse: effects of spinally administered opioids, phencyclidine and sigma agonists. J Pharmacol Exp Ther. 1990;243(1):9-19.',
    pmid: '2822930' },

  // Incisional
  { category: 'Incisional Pain Models', sub: 'Incisional', fullName: 'Plantar Incision',
    species: ['Mouse','Rat'],
    desc: "A 1-cm longitudinal incision of the plantar hindpaw skin, fascia and muscle models postoperative pain. Mechanical hypersensitivity develops within hours, peaks at 24 h and resolves over 3–5 days, closely mirroring human postoperative pain time course.",
    reference: 'Brennan TJ et al. Characterization of a rat model of incisional pain. Pain. 1996;64(3):493-501.',
    pmid: '8783314' },

  // Headache
  { category: 'Headache', sub: 'NTG', fullName: 'Nitroglycerin-Induced Migraine',
    species: ['Human','Mouse','Rat'],
    desc: "Systemic nitroglycerin (NTG) administration induces migraine-like allodynia through nitric-oxide donation, meningeal afferent sensitization and CGRP release. The most widely used pharmacological migraine model in preclinical research.",
    reference: 'Bates EA et al. Sumatriptan alleviates nitroglycerin-induced mechanical and thermal allodynia in mice. Cephalalgia. 2010;30(2):170-178.',
    pmid: '19489890' },
  { category: 'Headache', sub: 'CSD', fullName: 'Cortical Spreading Depression',
    species: ['Mouse','Rat'],
    desc: "Cortical spreading depression (CSD), a slow, propagating wave of neuronal and glial depolarization, is the electrophysiological correlate of migraine aura. Induced by focal KCl application or needle prick to cortex.",
    reference: 'Ayata C et al. Suppression of cortical spreading depression in migraine prophylaxis. Ann Neurol. 2006;59(4):652-661.',
    pmid: '16450381' },
];

/* ---------- Pain types ---------- */
const PAIN_TYPES = [
  { type:'Mechanical pain',  assessment:'Von Frey test',            desc:'Graded monofilaments applied to the plantar surface; withdrawal threshold is the 50% response filament.' },
  { type:'Mechanical pain',  assessment:'Randall-Selitto test',     desc:'Increasing pressure applied to paw with an analgesiometer; threshold is force at withdrawal/vocalization.' },
  { type:'Mechanical pain',  assessment:'Pin-prick test',           desc:'Noxious punctate stimulus; response duration or frequency is scored.' },
  { type:'Thermal pain',     assessment:'Hargreaves test',          desc:'Radiant heat focused on plantar surface; withdrawal latency measured.' },
  { type:'Thermal pain',     assessment:'Hot plate test',           desc:'Animal placed on 50–55°C plate; latency to licking/jumping recorded.' },
  { type:'Thermal pain',     assessment:'Cold plate / acetone test',desc:'Cold or evaporative stimulus; withdrawal duration scored.' },
  { type:'Thermal pain',     assessment:'Tail-flick test',          desc:'Radiant heat on tail; time to tail withdrawal recorded.' },
  { type:'Spontaneous pain', assessment:'Grimace scale',            desc:'Facial action-unit scoring (orbital tightening, nose bulge, ear/whisker change).' },
  { type:'Spontaneous pain', assessment:'Conditioned place preference', desc:'Analgesic-paired chamber preference indicates tonic pain relief.' },
  { type:'Visceral pain',    assessment:'Colorectal distension',    desc:'Balloon distension of distal colon; visceromotor response (EMG) recorded.' },
  { type:'Visceral pain',    assessment:'Abdominal writhing',       desc:'Intraperitoneal acetic acid induces writhing; count over 15–30 min.' },
];

/* ---------- Cell lines / tissues used ---------- */
const TISSUES = [
  'Dorsal root ganglion (DRG)',
  'Spinal cord dorsal horn',
  'Trigeminal ganglion',
  'Sciatic nerve',
  'Hindpaw skin',
  'Ankle joint',
  'Anterior cingulate cortex',
  'Bone marrow',
  'Colon',
  'HEK293T cells',
  'SH-SY5Y cells',
];

/* ---------- Gene pool (with Ensembl IDs) ---------- */
const GENES = [
  { symbol:'TRPV1',   ensembl_h:'ENSG00000196689',  ensembl_m:'ENSMUSG00000005952', ensembl_r:'ENSRNOG00000006543' },
  { symbol:'TRPA1',   ensembl_h:'ENSG00000104321',  ensembl_m:'ENSMUSG00000032769', ensembl_r:'ENSRNOG00000016245' },
  { symbol:'TRPM8',   ensembl_h:'ENSG00000144481',  ensembl_m:'ENSMUSG00000036251', ensembl_r:'ENSRNOG00000005678' },
  { symbol:'SCN9A',   ensembl_h:'ENSG00000169432',  ensembl_m:'ENSMUSG00000075316', ensembl_r:'ENSRNOG00000018932' },
  { symbol:'SCN10A',  ensembl_h:'ENSG00000185313',  ensembl_m:'ENSMUSG00000034533', ensembl_r:'ENSRNOG00000002345' },
  { symbol:'P2X4',    ensembl_h:'ENSG00000135124',  ensembl_m:'ENSMUSG00000029470', ensembl_r:'ENSRNOG00000019287' },
  { symbol:'P2X7',    ensembl_h:'ENSG00000089041',  ensembl_m:'ENSMUSG00000029470', ensembl_r:'ENSRNOG00000027654' },
  { symbol:'BDNF',    ensembl_h:'ENSG00000176697',  ensembl_m:'ENSMUSG00000048482', ensembl_r:'ENSRNOG00000011637' },
  { symbol:'CGRP',    ensembl_h:'ENSG00000110680',  ensembl_m:'ENSMUSG00000030748', ensembl_r:'ENSRNOG00000017892' },
  { symbol:'NGF',     ensembl_h:'ENSG00000134259',  ensembl_m:'ENSMUSG00000027859', ensembl_r:'ENSRNOG00000008976' },
  { symbol:'CXCL5',   ensembl_h:'ENSG00000163735',  ensembl_m:'ENSMUSG00000029371', ensembl_r:'ENSRNOG00000032145' },
  { symbol:'CXCL1',   ensembl_h:'ENSG00000163739',  ensembl_m:'ENSMUSG00000029375', ensembl_r:'ENSRNOG00000028541' },
  { symbol:'CCL2',    ensembl_h:'ENSG00000108691',  ensembl_m:'ENSMUSG00000035385', ensembl_r:'ENSRNOG00000021054' },
  { symbol:'IL1B',    ensembl_h:'ENSG00000125538',  ensembl_m:'ENSMUSG00000027398', ensembl_r:'ENSRNOG00000013938' },
  { symbol:'IL6',     ensembl_h:'ENSG00000136244',  ensembl_m:'ENSMUSG00000025746', ensembl_r:'ENSRNOG00000010278' },
  { symbol:'TNF',     ensembl_h:'ENSG00000232810',  ensembl_m:'ENSMUSG00000024401', ensembl_r:'ENSRNOG00000000837' },
  { symbol:'NLRP3',   ensembl_h:'ENSG00000162711',  ensembl_m:'ENSMUSG00000032691', ensembl_r:'ENSRNOG00000034187' },
  { symbol:'PIEZO2',  ensembl_h:'ENSG00000154864',  ensembl_m:'ENSMUSG00000041482', ensembl_r:'ENSRNOG00000033671' },
  { symbol:'ATF3',    ensembl_h:'ENSG00000162772',  ensembl_m:'ENSMUSG00000026628', ensembl_r:'ENSRNOG00000011276' },
  { symbol:'SPRR1A',  ensembl_h:'ENSG00000169474',  ensembl_m:'ENSMUSG00000050359', ensembl_r:'ENSRNOG00000016389' },
  { symbol:'GAL',     ensembl_h:'ENSG00000069482',  ensembl_m:'ENSMUSG00000024326', ensembl_r:'ENSRNOG00000011987' },
  { symbol:'GFAP',    ensembl_h:'ENSG00000131095',  ensembl_m:'ENSMUSG00000020932', ensembl_r:'ENSRNOG00000006514' },
  { symbol:'IBA1',    ensembl_h:'ENSG00000204472',  ensembl_m:'ENSMUSG00000024397', ensembl_r:'ENSRNOG00000028731' },
  { symbol:'NOS1',    ensembl_h:'ENSG00000089250',  ensembl_m:'ENSMUSG00000029361', ensembl_r:'ENSRNOG00000019762' },
  { symbol:'CALCA',   ensembl_h:'ENSG00000110680',  ensembl_m:'ENSMUSG00000030748', ensembl_r:'ENSRNOG00000017892' },
  { symbol:'SOX11',   ensembl_h:'ENSG00000176887',  ensembl_m:'ENSMUSG00000063632', ensembl_r:'ENSRNOG00000012876' },
  { symbol:'MRGPRD',  ensembl_h:'ENSG00000172209',  ensembl_m:'ENSMUSG00000047298', ensembl_r:'ENSRNOG00000027458' },
  { symbol:'KCNQ2',   ensembl_h:'ENSG00000075043',  ensembl_m:'ENSMUSG00000016346', ensembl_r:'ENSRNOG00000006789' },
];

/* ---------- Generate TPEA records ---------- */
function buildRecords() {
  const organisms = [
    { name: 'Homo sapiens', key: 'Human', ens: 'ensembl_h' },
    { name: 'Mus musculus', key: 'Mouse', ens: 'ensembl_m' },
    { name: 'Rattus norvegicus', key: 'Rat', ens: 'ensembl_r' },
  ];
  // Seeded RNG for reproducibility
  let seed = 20260424;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const pick = arr => arr[Math.floor(rand() * arr.length)];

  const recs = [];
  let id = 1;

  // Curated "real" combinations first to keep the data plausible
  const curated = [
    { g:'TRPV1',  o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'CCI',  seq:3, expr:4, pert:3 },
    { g:'TRPV1',  o:'Rat',   t:'Dorsal root ganglion (DRG)',    m:'CCI',  seq:2, expr:5, pert:4 },
    { g:'TRPV1',  o:'Human', t:'Dorsal root ganglion (DRG)',    m:'CFA',  seq:1, expr:2, pert:0 },
    { g:'TRPA1',  o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'Formalin', seq:2, expr:3, pert:3 },
    { g:'TRPM8',  o:'Rat',   t:'Dorsal root ganglion (DRG)',    m:'CIPN', seq:3, expr:2, pert:2 },
    { g:'SCN9A',  o:'Human', t:'Dorsal root ganglion (DRG)',    m:'DPN',  seq:2, expr:3, pert:1 },
    { g:'SCN10A', o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:4, expr:3, pert:2 },
    { g:'P2X4',   o:'Rat',   t:'Spinal cord dorsal horn',       m:'SNL',  seq:2, expr:3, pert:4 },
    { g:'BDNF',   o:'Mouse', t:'Spinal cord dorsal horn',       m:'SNI',  seq:3, expr:4, pert:3 },
    { g:'CGRP',   o:'Mouse', t:'Trigeminal ganglion',           m:'NTG',  seq:2, expr:3, pert:4 },
    { g:'CGRP',   o:'Rat',   t:'Trigeminal ganglion',           m:'NTG',  seq:1, expr:2, pert:3 },
    { g:'NGF',    o:'Mouse', t:'Hindpaw skin',                  m:'CFA',  seq:3, expr:4, pert:3 },
    { g:'CXCL5',  o:'Mouse', t:'Ankle joint',                   m:'MSU',  seq:2, expr:3, pert:2 },
    { g:'IL1B',   o:'Mouse', t:'Ankle joint',                   m:'MSU',  seq:3, expr:2, pert:1 },
    { g:'NLRP3',  o:'Mouse', t:'Ankle joint',                   m:'MSU',  seq:2, expr:3, pert:3 },
    { g:'IL6',    o:'Mouse', t:'Hindpaw skin',                  m:'CFA',  seq:2, expr:4, pert:2 },
    { g:'TNF',    o:'Rat',   t:'Sciatic nerve',                 m:'CCI',  seq:3, expr:4, pert:3 },
    { g:'CXCL1',  o:'Mouse', t:'Bone marrow',                   m:'BCP',  seq:2, expr:2, pert:3 },
    { g:'PIEZO2', o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'Carrageenan', seq:2, expr:2, pert:1 },
    { g:'ATF3',   o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:5, expr:2, pert:0 },
    { g:'SPRR1A', o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:3, expr:1, pert:0 },
    { g:'GAL',    o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:3, expr:2, pert:1 },
    { g:'SOX11',  o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:2, expr:2, pert:3 },
    { g:'GFAP',   o:'Rat',   t:'Spinal cord dorsal horn',       m:'CCI',  seq:3, expr:3, pert:1 },
    { g:'IBA1',   o:'Rat',   t:'Spinal cord dorsal horn',       m:'CCI',  seq:3, expr:4, pert:2 },
    { g:'CCL2',   o:'Mouse', t:'Hindpaw skin',                  m:'Incisional', seq:2, expr:3, pert:3 },
    { g:'NOS1',   o:'Mouse', t:'Trigeminal ganglion',           m:'NTG',  seq:1, expr:3, pert:2 },
    { g:'CALCA',  o:'Human', t:'Trigeminal ganglion',           m:'NTG',  seq:2, expr:2, pert:1 },
    { g:'P2X7',   o:'Mouse', t:'Spinal cord dorsal horn',       m:'SNI',  seq:2, expr:2, pert:3 },
    { g:'KCNQ2',  o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'CCI',  seq:1, expr:1, pert:2 },
    { g:'MRGPRD', o:'Mouse', t:'Dorsal root ganglion (DRG)',    m:'SNI',  seq:3, expr:0, pert:1 },
    { g:'TRPV1',  o:'Mouse', t:'Colon',                         m:'IBS',  seq:2, expr:3, pert:2 },
    { g:'TRPA1',  o:'Mouse', t:'Colon',                         m:'IBS',  seq:2, expr:2, pert:2 },
    { g:'TRPV1',  o:'Rat',   t:'Anterior cingulate cortex',     m:'Capsaicin', seq:2, expr:1, pert:1 },
    { g:'BDNF',   o:'Mouse', t:'Anterior cingulate cortex',     m:'NMDA', seq:1, expr:2, pert:2 },
  ];

  curated.forEach(r => {
    const gene = GENES.find(x => x.symbol === r.g);
    const org = organisms.find(o => o.key === r.o);
    if (!gene || !org) return;
    const model = PAIN_MODELS.find(m => m.sub === r.m);
    recs.push({
      tpea_id: 'TPEA_' + String(id++).padStart(5, '0'),
      gene: gene.symbol,
      ensembl: gene[org.ens],
      organism: org.key,
      organism_sci: org.name,
      tissue: r.t,
      model_cat: model.category,
      model_sub: r.m,
      seq: r.seq, expr: r.expr, pert: r.pert,
      confidence: r.seq + r.expr + r.pert,
    });
  });

  // Generate additional synthetic records to fill out tables
  const tissues = TISSUES;
  const orgsWithOthers = [...organisms, { name:'Canis familiaris', key:'Others', ens:'ensembl_h' }];
  for (let i = 0; i < 130; i++) {
    const g = pick(GENES);
    const o = pick(orgsWithOthers);
    const mdl = pick(PAIN_MODELS);
    const t = pick(tissues);
    const seq = Math.floor(rand() * 4);
    const expr = Math.floor(rand() * 5);
    const pert = Math.floor(rand() * 4);
    if (seq + expr + pert === 0) continue;
    recs.push({
      tpea_id: 'TPEA_' + String(id++).padStart(5, '0'),
      gene: g.symbol,
      ensembl: g[o.ens],
      organism: o.key,
      organism_sci: o.name,
      tissue: t,
      model_cat: mdl.category,
      model_sub: mdl.sub,
      seq, expr, pert,
      confidence: seq + expr + pert,
    });
  }
  return recs;
}

const RECORDS = buildRecords();

/* ---------- Detail evidence records keyed by TPEA ID ---------- */
function buildEvidence(rec) {
  const effects = {
    TRPV1:  'TRPV1 expression significantly increased in the injured ganglion; genetic ablation or pharmacological antagonism reverses thermal hyperalgesia.',
    TRPA1:  'TRPA1 mediates mechanical and cold allodynia; upregulated in the tonic phase of formalin-induced pain.',
    TRPM8:  'TRPM8 upregulation on DRG neurons drives cold allodynia induced by oxaliplatin.',
    SCN9A:  'Nav1.7 (SCN9A) gain-of-function mutations cause erythromelalgia; knockdown reduces diabetic mechanical allodynia.',
    SCN10A: 'Nav1.8 (SCN10A) protein elevated in ipsilateral DRG; siRNA knockdown attenuates mechanical hypersensitivity.',
    P2X4:   'P2X4 receptor upregulated in spinal microglia; intrathecal antagonist reverses tactile allodynia.',
    BDNF:   'BDNF release from microglia drives central sensitization; conditional KO rescues mechanical allodynia.',
    CGRP:   'CGRP released from trigeminal afferents; anti-CGRP monoclonal antibody prevents NTG-induced periorbital allodynia.',
    NGF:    'NGF drives peripheral sensitization; anti-NGF antibody (tanezumab) reduces inflammatory pain in clinical trials.',
    CXCL5:  'CXCL5 is upregulated in ankle joints and recruits neutrophils; Cxcl5-/- mice display reduced MSU-induced allodynia.',
    IL1B:   'IL-1β is a pivotal inflammasome-derived cytokine; neutralization reduces MSU- and CFA-induced hyperalgesia.',
    NLRP3:  'NLRP3 inflammasome activation is required for MSU-induced joint inflammation and pain.',
    IL6:    'IL-6/JAK/STAT3 signaling mediates CFA-induced hyperalgesia.',
    TNF:    'TNF-α drives neuroinflammation in the injured nerve; etanercept attenuates CCI-induced thermal hyperalgesia.',
    CXCL1:  'CXCL1 is elevated in tumor-bearing tibia; CXCR2 antagonism reduces bone cancer pain.',
    PIEZO2: 'Piezo2 mediates mechanical hyperalgesia during inflammation; conditional KO attenuates allodynia.',
    ATF3:   'ATF3 is the canonical injury marker in DRG neurons; strongly induced 3–7 days after nerve injury.',
    SPRR1A: 'SPRR1A is a regeneration-associated gene induced in injured DRG neurons.',
    GAL:    'Galanin is upregulated in injured DRG neurons and participates in the endogenous analgesia response.',
    SOX11:  'SOX11 controls regeneration-associated gene expression after nerve injury; AAV-shSOX11 attenuates allodynia.',
    GFAP:   'Astrocyte activation (GFAP↑) drives chronic central sensitization after CCI.',
    IBA1:   'Microglial activation (IBA1↑) is an early driver of neuropathic pain after CCI.',
    CCL2:   'CCL2-CCR2 signaling at the incision site drives post-surgical mechanical hypersensitivity.',
    NOS1:   'Neuronal NOS (nNOS/NOS1) activity increases after NTG; NOS inhibitors attenuate migraine-like allodynia.',
    CALCA:  'CALCA encodes CGRP, a key migraine mediator; elevated release during NTG-induced attacks.',
    P2X7:   'P2X7 on microglia licenses IL-1β release during chronic pain states; antagonists reduce SNI allodynia.',
    KCNQ2:  'KCNQ2/M-current loss contributes to DRG hyperexcitability; retigabine (KCNQ opener) produces antinociception.',
    MRGPRD: 'MRGPRD-expressing nociceptors are required for acute mechanical pain; ablation reduces SNI mechanical sensitivity.',
  };
  const effect = effects[rec.gene] || `${rec.gene} shows differential regulation in this pain-model context; functional and transcriptomic evidence converge on a pain-associated role.`;

  // Sequencing only includes bulk-level assays per spec  no scRNA-seq or single-cell
  const seqAssays = ['RNA-Seq','miRNA-Seq','Microarray','Bulk RNA-Seq'];
  const seqRows = [];
  for (let i = 0; i < rec.seq; i++) {
    seqRows.push({
      analysis_id: 'TPEA-S-' + String(rec.tpea_id || '00001').replace(/[^0-9]/g, '').padStart(5, '0') + '-' + String(i + 1).padStart(2, '0'),
      gse: 'GSE' + (100000 + Math.floor(Math.random()*80000)),
      assay: seqAssays[Math.floor(Math.random()*seqAssays.length)],
      tissue: rec.tissue,
      direction: Math.random() > 0.3 ? 'Up' : 'Down',
      log2fc: (Math.random() * 4 + 0.5) * (Math.random() > 0.3 ? 1 : -1),
      pvalue: Math.pow(10, -(Math.random()*12 + 4)),
      adjp:   Math.pow(10, -(Math.random()*8 + 2)),
      samples: '3 ctrl / 3 pain',
      pmid: 30000000 + Math.floor(Math.random()*9000000),
    });
  }
  const exprAssays = ['RT-qPCR','Western blot','ELISA','Immunohistochemistry','Immunofluorescence','Northern blot','FISH','Flow cytometry'];
  const diseaseByCat = {
    'Neuropathic Pain Models':       ['Neuropathic pain','Diabetic neuropathy','Chemotherapy-induced peripheral neuropathy','Postherpetic neuralgia'],
    'Inflammatory Pain Models':      ['Gouty arthritis','Rheumatoid arthritis','Cutaneous inflammation','Osteoarthritis'],
    'Visceral Pain Models':          ['Irritable bowel syndrome','Interstitial cystitis','Visceral hypersensitivity'],
    'Cancer Pain Models':            ['Bone cancer pain','Cancer-induced bone pain','Metastatic bone disease'],
    'Central Sensitization Models':  ['Chronic widespread pain','Fibromyalgia','Central sensitization syndrome'],
    'Incisional Pain Models':        ['Postoperative pain','Surgical incisional pain'],
    'Headache Models':               ['Migraine','Cluster headache','Trigeminal neuralgia'],
  };
  const diseasesForRec = diseaseByCat[rec.model_cat] || ['Pain disorder'];
  const exprRows = [];
  for (let i = 0; i < rec.expr; i++) {
    const dirVal = Math.random() > 0.25 ? 'Up' : 'Down';
    const method = exprAssays[Math.floor(Math.random()*exprAssays.length)];
    const exprEffect = `${rec.gene} expression in ${rec.tissue} was significantly ${dirVal === 'Up' ? 'upregulated' : 'downregulated'} in ${rec.model_sub} model vs. control as detected by ${method}.`;
    exprRows.push({
      analysis_id: 'TPEA-E-' + String(rec.tpea_id || '00001').replace(/[^0-9]/g, '').padStart(5, '0') + '-' + String(i + 1).padStart(2, '0'),
      level: 'Expression',
      gene: rec.gene,
      pain_model_category: rec.model_cat,
      pain_model_sub: rec.model_sub,
      source: rec.tissue,             // tissue/cell where expression assessed
      perturbation_site: 'NA',
      organism: rec.organism_sci || rec.organism,
      expression_assessment: method,
      pain_type: 'NA',
      pain_assessment: 'NA',
      perturbation: 'NA',
      perturbation_method: 'NA',
      method,                          // legacy alias
      tissue: rec.tissue,              // legacy alias
      direction: dirVal,
      effect: exprEffect,
      disease: diseasesForRec[Math.floor(Math.random()*diseasesForRec.length)],
      pmid: 25000000 + Math.floor(Math.random()*14000000),
    });
  }

  /* Perturbation rows — full schema per spec.
     Perturbation type → Perturbation method dictionary mapping. */
  const PERT_DICT = {
    'Overexpress': ['Electroporation','Gene Gun','Liposomal Transfection','Viral-Mediated Transfection','CRISPRa'],
    'Knockout':    ['CRISPR-Cas9','Cre-loxP'],
    'Knock down':  ['siRNA','shRNA','ASO','CRISPRi'],
    'Inhibitor':   ['Neutralizing antibody','SB225002','A-803467','Capsazepine','HC-030031'],
    'Agonist':     ['Capsaicin','AITC','SR141716A'],
  };
  const pertTypes = Object.keys(PERT_DICT);
  const painTypeOpts = ['Mechanical pain','Thermal pain','Cold pain','Chemical pain','Visceral pain','Electrophysiology','Spontaneous behavior'];
  const painAssayMap = {
    'Mechanical pain':       ['Von Frey test','Randall-Selitto test'],
    'Thermal pain':          ['Hargreaves test','Hot plate test','Tail flick test'],
    'Cold pain':             ['Cold plate test','Acetone test'],
    'Chemical pain':         ['Formalin test','Capsaicin test'],
    'Visceral pain':         ['Acetic acid writhing test','Colorectal distension'],
    'Electrophysiology':     ['Patch clamp recording','Multi-electrode array'],
    'Spontaneous behavior':  ['Grimace scale','Open field assay'],
  };
  const pertRows = [];
  for (let i = 0; i < rec.pert; i++) {
    const pType = pertTypes[Math.floor(Math.random()*pertTypes.length)];
    const pMethod = PERT_DICT[pType][Math.floor(Math.random()*PERT_DICT[pType].length)];
    const pPainType = painTypeOpts[Math.floor(Math.random()*painTypeOpts.length)];
    const pAssay = painAssayMap[pPainType][Math.floor(Math.random()*painAssayMap[pPainType].length)];
    const useSystemic = pType === 'Knockout' || pType === 'Knock down';
    const pSite = useSystemic ? 'Systemic' : rec.tissue;
    const pSource = rec.tissue;
    /* Direction = whether the gene's expression direction and the pain
       phenotype direction are CONSISTENT (a unified semantic across all
       three evidence tiers):

         "Up"   = expression direction and pain direction agree
                   (e.g. higher expression coincides with more pain;
                    or KO of the gene → less pain)
         "Down" = expression direction and pain direction disagree
                   (e.g. higher expression but less pain;
                    or KO of the gene → more pain)

       For perturbation rows we derive Direction from:
         (a) loss-of-function vs gain-of-function perturbation, and
         (b) whether the resulting pain phenotype was attenuated or
             exacerbated.

         loss-of-function (KO/KD/Inhibitor/Antagonist) AND pain attenuated → consistent → "Up"   (gene is pro-pain)
         loss-of-function                            AND pain exacerbated → opposite   → "Down" (gene is anti-pain)
         gain-of-function (Overexpress/Agonist)      AND pain exacerbated → consistent → "Up"
         gain-of-function                            AND pain attenuated  → opposite   → "Down"

       Most published studies report a "consistent" outcome (the authors
       intentionally chose loss-of-function on a putative pro-pain gene,
       or gain-of-function on a putative anti-pain gene), so we bias the
       random choice toward "Up" (~70 %) to mirror reality. */
    const lossOfFunction = pType === 'Knockout' || pType === 'Knock down' || pType === 'Inhibitor' || pType === 'Antagonist';
    const pDirection = Math.random() < 0.7 ? 'Up' : 'Down';
    let painChanged;
    if (pDirection === 'Up') {
      // consistent: LoF → less pain ; GoF → more pain
      painChanged = lossOfFunction ? 'attenuated' : 'exacerbated';
    } else {
      // opposite: LoF → more pain ; GoF → less pain
      painChanged = lossOfFunction ? 'exacerbated' : 'attenuated';
    }
    const pertEffect = `${pType} of ${rec.gene} (${pMethod}) significantly ${painChanged} ${pPainType.toLowerCase()} in the ${rec.model_sub} model as measured by ${pAssay}.`;
    pertRows.push({
      analysis_id: 'TPEA-P-' + String(rec.tpea_id || '00001').replace(/[^0-9]/g, '').padStart(5, '0') + '-' + String(i + 1).padStart(2, '0'),
      level: 'Perturbation',
      gene: rec.gene,
      pain_model_category: rec.model_cat,
      pain_model_sub: rec.model_sub,
      source: pSource,                       // tissue/cell where perturbation success was confirmed
      perturbation_site: pSite,              // injection / processing site, or "Systemic"
      organism: rec.organism_sci || rec.organism,
      pain_type: pPainType,
      pain_assessment: pAssay,
      perturbation: pType,
      perturbation_method: pMethod,
      direction: pDirection,                 // Up (consistent) | Down (opposite)
      effect: pertEffect,
      disease: diseasesForRec[Math.floor(Math.random()*diseasesForRec.length)],
      pmid: 25000000 + Math.floor(Math.random()*14000000),
    });
  }

  /* Mock RNA-associated diseases (DisGeNET-style) */
  const diseasePool = [
    { name: 'Neuropathic Pain', cui: 'C0027796' },
    { name: 'Inflammatory Pain', cui: 'C2937257' },
    { name: 'Chronic Pain', cui: 'C0150055' },
    { name: 'Fibromyalgia', cui: 'C0016053' },
    { name: 'Migraine Disorders', cui: 'C0149931' },
    { name: 'Diabetic Peripheral Neuropathy', cui: 'C0011882' },
    { name: 'Rheumatoid Arthritis', cui: 'C0003873' },
    { name: 'Osteoarthritis', cui: 'C0029408' },
    { name: 'Gouty Arthritis', cui: 'C0018099' },
    { name: 'Postherpetic Neuralgia', cui: 'C0032768' },
    { name: 'Trigeminal Neuralgia', cui: 'C0040997' },
    { name: 'Visceral Pain', cui: 'C0042963' },
    { name: 'Bone Cancer Pain', cui: 'C1335713' },
    { name: 'Irritable Bowel Syndrome', cui: 'C0022104' },
  ];
  const dCount = Math.min(diseasePool.length, 4 + Math.floor(Math.random() * 8));
  const diseaseRows = [];
  for (let i = 0; i < dCount; i++) {
    const d = diseasePool[i];
    diseaseRows.push({
      gene: rec.gene,
      disease: d.name,
      source: 'DisGeNET:' + d.cui,
      pmid: 15000000 + Math.floor(Math.random() * 25000000),
    });
  }

  /* Mock disease-associated variants */
  const variantTypes = ['SNV','InDel','SNV','SNV'];
  const origins = ['germline','somatic'];
  const sources = ['ClinVar','ICGC','ClinVar','TCGA','dbSNP'];
  const vCount = 2 + Math.floor(Math.random() * 4);
  const variantRows = [];
  for (let i = 0; i < vCount; i++) {
    const refs = ['A','G','C','T'];
    const ref = refs[Math.floor(Math.random() * 4)];
    let alt = refs[Math.floor(Math.random() * 4)];
    while (alt === ref) alt = refs[Math.floor(Math.random() * 4)];
    const chr = Math.ceil(Math.random() * 22);
    const pos = 1000000 + Math.floor(Math.random() * 200000000);
    variantRows.push({
      gene: rec.gene,
      origin: origins[Math.floor(Math.random() * 2)],
      genomic_location: 'chr' + chr + ':' + pos.toLocaleString() + '(' + (Math.random() > 0.5 ? '+' : '-') + ')',
      ref, alt,
      type: variantTypes[Math.floor(Math.random() * variantTypes.length)],
      dbsnp: Math.random() > 0.4 ? 'rs' + (10000000 + Math.floor(Math.random() * 990000000)) : '',
      associated_disease: diseasePool[Math.floor(Math.random() * diseasePool.length)].name,
      source: sources[Math.floor(Math.random() * sources.length)],
    });
  }

  return { seqRows, exprRows, pertRows, diseaseRows, variantRows };
}

/* Map from short species key to its Latin scientific name.
   "Others" includes anything not Homo/Mus/Rattus; here we use Canis familiaris
   (the seeded record explicitly added Canis as the only Others representative). */
const SPECIES_SCI = {
  Human:  'Homo sapiens',
  Mouse:  'Mus musculus',
  Rat:    'Rattus norvegicus',
  Others: 'Canis familiaris',
};
function speciesSci(orgKey) {
  return SPECIES_SCI[orgKey] || orgKey;
}

/* ---- Tissue / cell-line catalog ---------------------------------------
   Standardized name + biological cell type + originating tissue + anatomical
   site of derivation. This is the lookup the TSV download exposes. The user
   provided 15 sample entries spanning Adipose and Bile-duct tissues; we
   extend the set across the tissues used in the records corpus so every
   record has a corresponding source row. */
const TISSUE_CELL_CATALOG = [
  // ---- Adipose ---------------------------------------------------------
  { new_name: 'ADSCs',              cell_type: 'Adipose-derived mesenchymal stem cells', tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'Beige adipocytes',   cell_type: 'Beige adipocytes',                       tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'Brown adipocytes',   cell_type: 'Brown adipocytes',                       tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'Brown preadipocytes',cell_type: 'Brown preadipocytes',                    tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'HASCs',              cell_type: 'Human adipose-derived stem cells',       tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'Rabbit preadipocytes', cell_type: 'Preadipocytes',                        tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'White adipocytes',   cell_type: 'White adipocytes',                       tissue: 'Adipose', derived_from: 'Adipose' },
  { new_name: 'YIMAs',              cell_type: 'Yak intramuscular pre-adipocytes',       tissue: 'Adipose', derived_from: 'Adipose' },
  // ---- Bile duct -------------------------------------------------------
  { new_name: 'FRH0201',            cell_type: 'Cholangiocarcinoma cells',               tissue: 'Bile duct', derived_from: 'Intrahepatic bile duct' },
  { new_name: 'H1 [Intrahepatic cholangiocarcinoma]', cell_type: 'Cholangiocarcinoma cells', tissue: 'Bile duct', derived_from: 'Intrahepatic bile duct' },
  { new_name: 'HCCC-9810',          cell_type: 'Cholangiocarcinoma cells',               tissue: 'Bile duct', derived_from: 'Intrahepatic bile duct' },
  // ---- DRG (primary tissue used in pain studies) ----------------------
  { new_name: 'DRG (whole)',        cell_type: 'Dorsal root ganglion neurons (whole tissue)', tissue: 'Dorsal root ganglion', derived_from: 'Lumbar DRG (L4-L6)' },
  { new_name: 'DRG-SCN10A+',        cell_type: 'Nav1.8-expressing nociceptors',          tissue: 'Dorsal root ganglion', derived_from: 'Lumbar DRG' },
  { new_name: 'DRG-TRPV1+',         cell_type: 'TRPV1-expressing nociceptors',           tissue: 'Dorsal root ganglion', derived_from: 'Lumbar DRG' },
  { new_name: 'F11',                cell_type: 'Mouse neuroblastoma × rat DRG hybrid cells', tissue: 'Dorsal root ganglion', derived_from: 'DRG (immortalized)' },
  { new_name: 'iPSC-Sensory',       cell_type: 'iPSC-derived sensory neurons',           tissue: 'Dorsal root ganglion', derived_from: 'Human iPSC (peripheral neuron)' },
  // ---- Spinal cord ----------------------------------------------------
  { new_name: 'Spinal cord (dorsal horn)', cell_type: 'Mixed dorsal-horn neurons + glia', tissue: 'Spinal cord', derived_from: 'Lumbar dorsal horn' },
  { new_name: 'BV-2',               cell_type: 'Murine microglial cell line',            tissue: 'Spinal cord', derived_from: 'C57BL/6 microglia' },
  // ---- Trigeminal ganglion --------------------------------------------
  { new_name: 'TG (whole)',         cell_type: 'Trigeminal ganglion neurons',            tissue: 'Trigeminal ganglion', derived_from: 'Trigeminal ganglion' },
  // ---- Ankle joint / synovium -----------------------------------------
  { new_name: 'FLS',                cell_type: 'Fibroblast-like synoviocytes',           tissue: 'Synovium', derived_from: 'Synovial membrane' },
  { new_name: 'Ankle joint (whole)',cell_type: 'Mixed joint tissue',                     tissue: 'Ankle joint', derived_from: 'Ankle joint capsule + cartilage' },
  // ---- Skin -----------------------------------------------------------
  { new_name: 'HEKa',               cell_type: 'Human epidermal keratinocytes (adult)',  tissue: 'Skin', derived_from: 'Adult epidermis' },
  { new_name: 'Skin (whole)',       cell_type: 'Mixed skin tissue (epidermis + dermis)', tissue: 'Skin', derived_from: 'Plantar / glabrous skin' },
  // ---- Brain ----------------------------------------------------------
  { new_name: 'ACC (whole)',        cell_type: 'Anterior cingulate cortex tissue',       tissue: 'Brain', derived_from: 'Anterior cingulate cortex' },
  { new_name: 'PAG (whole)',        cell_type: 'Periaqueductal grey tissue',             tissue: 'Brain', derived_from: 'Periaqueductal grey' },
];

window.TPEA_DATA = {
  painModels: PAIN_MODELS,
  painTypes: PAIN_TYPES,
  tissues: TISSUES,
  genes: GENES,
  records: RECORDS,
  tissueCellCatalog: TISSUE_CELL_CATALOG,
  organisms: ['Human','Mouse','Rat','Others'],
  speciesSci,
  speciesSciList: ['Homo sapiens','Mus musculus','Rattus norvegicus','Canis familiaris'],
  painCategories: [...new Set(PAIN_MODELS.map(m => m.category))],
  /* --- Evidence tier definitions (ordered HIGH → LOW evidence quality) ---
     Underlying record fields stay as seq / expr / pert so we don't have to
     migrate 1000 references. The display layer uses these tier objects to
     get the correct label, short label (for compact UI), and color. */
  evidenceTiers: [
    { key: 'pert', label: 'Validated perturbation',            short: 'VP',  shortAbbr: 'VP',  color: '#3492B2' },
    { key: 'expr', label: 'Validated differential expression', short: 'VDE', shortAbbr: 'VDE', color: '#58BBD1' },
    { key: 'seq',  label: 'High-throughput profiling',         short: 'HTP', shortAbbr: 'HTP', color: '#9ED17B' },
  ],
  /* Legacy name kept as an alias — same colors as before */
  evidenceColors: { seq: '#9ED17B', expr: '#58BBD1', pert: '#3492B2' },
  buildEvidence,
};
