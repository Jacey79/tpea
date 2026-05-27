/* ================================================================
   TPEA shared layout v3.0 — rebuilt to PDF spec
     - Sticky navy header with TPEA wordmark + nav
     - Simple footer: "TPEA © 2026 The Ren Lab. All Rights Reserved"
     - Back-to-top button on every page
     - Pagination with page jumper
   Include on every page with <script src="js/layout.js"></script>
   then call TPEA_LAYOUT.mount();
   ================================================================ */

(function () {
  const NAV = [
    { href: 'index.html',    label: 'Home' },
    { href: 'browse.html',   label: 'Browse' },
    { href: 'search.html',   label: 'Search' },
    { href: 'download.html', label: 'Download' },
    { href: 'help.html',     label: 'Help' },
    { href: 'contact.html',  label: 'Contact' },
    { href: 'citation.html', label: 'Citation' },
  ];

  function currentFile() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  /* Logo — pain ribbon (semicolon style) inside a circle.
     Designed for TPEA: a stylized abstract pain awareness ribbon
     with a small accent dot, clean and memorable at small sizes. */
  function logoMarkSVG(size = 40) {
    return `<img src="data/favicon.png" width="${size}" height="${size}" alt="TPEA logo" style="border-radius:4px;vertical-align:middle;">`;
  }

  function headerHTML() {
    const cur = currentFile();
    const links = NAV.map(n => {
      const active = (n.href === cur) ? ' class="active"' : '';
      return `<a${active} href="${n.href}">${n.label}</a>`;
    }).join('');
    return `
<header class="header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="TPEA home">
      <span class="brand-mark">${logoMarkSVG(40)}</span>
      <span class="brand-word">TPEA</span>
    </a>
    <nav class="nav">${links}</nav>
  </div>
</header>`;
  }

  function footerHTML() {
    return `
<footer class="footer">
  <div class="container">
    TPEA &copy; 2026 The Ren Lab. All Rights Reserved
  </div>
</footer>
<button class="btt" id="back-to-top" aria-label="Back to top" title="Back to top">
  <svg viewBox="0 0 24 24"><polyline points="6 14 12 8 18 14"/></svg>
</button>`;
  }

  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    function onScroll() {
      if (window.scrollY > 240) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }

  /* Sort all <option> elements inside every <select> on the page
     alphabetically (per spec — keeping any "All" or empty-value
     placeholder option pinned to the top). Called after pages
     finish populating their <select> elements. */
  function sortAllSelectOptions(scope) {
    const root = scope || document;
    root.querySelectorAll('select').forEach(sel => {
      const opts = [...sel.options];
      // Identify pinned options: any option with empty value or value="all"
      const pinned = [];
      const sortable = [];
      opts.forEach(o => {
        const v = (o.value || '').trim().toLowerCase();
        const txt = (o.textContent || '').trim().toLowerCase();
        if (!v || v === 'all' || txt === 'all' || txt.startsWith('all ')) pinned.push(o);
        else sortable.push(o);
      });
      sortable.sort((a, b) => a.textContent.localeCompare(b.textContent));
      // Re-append in order
      const selected = sel.value;
      pinned.forEach(o => sel.appendChild(o));
      sortable.forEach(o => sel.appendChild(o));
      if (selected) sel.value = selected;
    });
  }

  window.TPEA_LAYOUT = {
    mount() {
      // Mount header DIRECTLY as a child of <body> so position:sticky works
      // (sticky requires the element's direct parent to be the scrolling container)
      const headerWrap = document.createElement('div');
      headerWrap.innerHTML = headerHTML();
      // Insert each top-level node (the <header> element) directly into body
      while (headerWrap.firstChild) {
        document.body.insertBefore(headerWrap.firstChild, document.body.firstChild);
      }

      const footWrap = document.createElement('div');
      footWrap.innerHTML = footerHTML();
      while (footWrap.firstChild) {
        document.body.appendChild(footWrap.firstChild);
      }

      setupBackToTop();
    },
    logoMarkSVG,
    sortAllSelectOptions
  };

  window.TPEA_UTIL = {
    qs(sel, root = document) { return root.querySelector(sel); },
    qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; },
    esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    pmidLink(pmid) {
      if (!pmid) return '';
      return `<a href="https://pubmed.ncbi.nlm.nih.gov/${pmid}/" target="_blank" rel="noopener" class="text-mono">${pmid}</a>`;
    },
    geoLink(gse) {
      if (!gse) return '';
      return `<a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${gse}" target="_blank" rel="noopener" class="text-mono">${gse}</a>`;
    },
    ensemblLink(ens) {
      if (!ens) return '';
      return `<a href="https://www.ensembl.org/id/${ens}" target="_blank" rel="noopener" class="text-mono">${ens}</a>`;
    },
    evNum(n, href) {
      if (!n) return `<span class="ev-num ev-num--empty" title="No evidence">&ndash;</span>`;
      return `<a class="ev-num" href="${href}" title="${n} record${n>1?'s':''}">${n}</a>`;
    },
    /* up/down direction badge — same width and same height per spec */
    dirBadge(dir) {
      if (!dir) return '';
      const d = String(dir).toLowerCase();
      if (d === 'up') return `<span class="dir-badge up">Up</span>`;
      if (d === 'down') return `<span class="dir-badge down">Down</span>`;
      return `<span class="dir-badge dim">${this.esc(dir)}</span>`;
    },
    /* Perturbation-specific direction badge.
       Direction values are now Up / Down (matching HTP and Validated DE):
         - Down = perturbation reduced pain (loss-of-function = pro-pain)
         - Up   = perturbation increased pain (loss-of-function = anti-pain)
       Color semantics are inverted vs. expression direction:
         - Down (good outcome) → green
         - Up   (worse outcome) → red */
    dirBadgePert(dir) { return this.dirBadge(dir); },
    exportCSV(rows, headers, filename) {
      const esc = v => {
        if (v == null) return '';
        const s = String(v).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      };
      const csv = [headers.map(esc).join(',')]
        .concat(rows.map(r => headers.map(h => esc(r[h])).join(',')))
        .join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 200);
    },
    getQueryParam(name) {
      var q = location.search || '';
      if (q.charAt(0) === '?') q = q.slice(1);
      var parts = q.split('&');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('=');
        if (decodeURIComponent(kv[0]) === name) return decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      }
      return null;
    },
    /* Pager with page numbers, page-size selector, and page-jump input */
    renderPager(container, currentPage, pageCount, total, onChange, onPageSize) {
      container.innerHTML = '';

      // info on left
      const info = document.createElement('div');
      info.className = 'pager-info';
      info.innerHTML = `Total <strong>${total.toLocaleString()}</strong>`;
      container.appendChild(info);

      // page buttons
      const pages = document.createElement('div');
      pages.className = 'pager-pages';
      const make = (n, label, disabled, active) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        if (disabled) btn.disabled = true;
        if (active) btn.classList.add('active');
        if (!disabled) btn.addEventListener('click', () => onChange(n));
        return btn;
      };
      pages.appendChild(make(currentPage - 1, '\u2039', currentPage === 1));
      const list = [];
      const push = n => { if (!list.includes(n) && n >= 1 && n <= pageCount) list.push(n); };
      push(1); push(pageCount);
      for (let i = currentPage - 2; i <= currentPage + 2; i++) push(i);
      list.sort((a, b) => a - b);
      let last = 0;
      list.forEach(p => {
        if (last && p - last > 1) {
          const span = document.createElement('span');
          span.textContent = '\u2026';
          span.className = 'ellipsis';
          pages.appendChild(span);
        }
        pages.appendChild(make(p, p, false, p === currentPage));
        last = p;
      });
      pages.appendChild(make(currentPage + 1, '\u203A', currentPage === pageCount));
      container.appendChild(pages);

      // page-size
      if (onPageSize) {
        const sz = document.createElement('div');
        sz.className = 'pager-pagesize';
        sz.innerHTML = `<select aria-label="Page size">
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
        </select>`;
        const sel = sz.querySelector('select');
        sel.addEventListener('change', e => onPageSize(Number(e.target.value)));
        container.appendChild(sz);
      }

      // jump
      const jump = document.createElement('div');
      jump.className = 'pager-jump';
      jump.innerHTML = `Go to <input type="text" maxlength="6" aria-label="Jump to page"> Page`;
      const inp = jump.querySelector('input');
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const n = Math.max(1, Math.min(pageCount, parseInt(inp.value, 10) || 1));
          onChange(n);
        }
      });
      container.appendChild(jump);
    },

    /* ============================================================
       Render an SVG element as a single-page PDF and trigger a
       browser download. Optionally include legend items at the top
       and/or a vertically-stacked legend at the bottom.

         svgEl    : the SVG element to render
         filename : base name (no extension) — '.pdf' is appended
         opts:
           legendItems       : [{label, color}] horizontal legend at top
           bottomLegendItems : [{label, color}] vertical legend at bottom
                               (rendered as native SVG so it never gets
                                truncated; page width auto-expands to fit
                                the longest label).
       ============================================================ */
    downloadSvgAsPdf(svgEl, filename, opts) {
      opts = opts || {};
      const items   = opts.legendItems       || [];
      const bottom  = opts.bottomLegendItems || [];
      const vb = svgEl.viewBox.baseVal;
      const origW = (vb && vb.width)  ? vb.width  : (svgEl.clientWidth  || 800);
      const origH = (vb && vb.height) ? vb.height : (svgEl.clientHeight || 400);

      const NS = 'http://www.w3.org/2000/svg';

      // Geometry constants for the bottom legend (one item per line)
      const bottomLineH = 22;
      const bottomFontPx = 13;
      const bottomDotR = 5;
      const bottomPadL = 16;
      const bottomPadT = 14;
      const bottomPadB = 10;
      // Estimate widest label so we can auto-expand the page width if needed.
      // 7.6 px per char for Arial 13 is a generous heuristic that prevents
      // truncation at the cost of slight extra padding on long labels.
      const charPx = 7.6;
      const dotAndGap = bottomDotR * 2 + 8;
      const bottomLongest = bottom.length
        ? Math.max(...bottom.map(it => bottomPadL + dotAndGap + it.label.length * charPx + 16))
        : 0;
      const finalW = Math.max(origW, bottomLongest);

      const legendH  = items.length  ? 32 : 0;
      const captionH = bottom.length ? bottomPadT + bottom.length * bottomLineH + bottomPadB : 0;
      const newH = origH + legendH + captionH;

      const wrapper = document.createElementNS(NS, 'svg');
      wrapper.setAttribute('xmlns', NS);
      wrapper.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      wrapper.setAttribute('viewBox', '0 0 ' + finalW + ' ' + newH);
      wrapper.setAttribute('width',  finalW);
      wrapper.setAttribute('height', newH);

      // White background
      const bg = document.createElementNS(NS, 'rect');
      bg.setAttribute('x', 0); bg.setAttribute('y', 0);
      bg.setAttribute('width', finalW); bg.setAttribute('height', newH);
      bg.setAttribute('fill', '#ffffff');
      wrapper.appendChild(bg);

      // Top legend (horizontal)
      if (items.length) {
        const itemPadX = 22;
        const swatchW = 12;
        const labelGap = 8;
        const fontPx = 13;
        const widths = items.map(it => swatchW + labelGap + Math.max(40, it.label.length * 7.5));
        const totalW = widths.reduce((a, w) => a + w, 0) + (items.length - 1) * itemPadX;
        let x = (finalW - totalW) / 2;
        const yText = 20;
        items.forEach((it, idx) => {
          const swatch = document.createElementNS(NS, 'rect');
          swatch.setAttribute('x', x); swatch.setAttribute('y', yText - 10);
          swatch.setAttribute('width', swatchW); swatch.setAttribute('height', 12);
          swatch.setAttribute('rx', 2);
          swatch.setAttribute('fill', it.color);
          wrapper.appendChild(swatch);

          const text = document.createElementNS(NS, 'text');
          text.setAttribute('x', x + swatchW + labelGap);
          text.setAttribute('y', yText);
          text.setAttribute('font-family', 'Arial, sans-serif');
          text.setAttribute('font-size', fontPx);
          text.setAttribute('font-weight', '600');
          text.setAttribute('fill', '#1f2941');
          text.textContent = it.label;
          wrapper.appendChild(text);

          x += widths[idx] + itemPadX;
        });
      }

      // Embed the original SVG body translated down by legendH (centered if
      // we expanded the page width to accommodate a long bottom legend).
      const cloned = svgEl.cloneNode(true);
      cloned.removeAttribute('style');
      const gWrap = document.createElementNS(NS, 'g');
      const xOffset = (finalW - origW) / 2;
      gWrap.setAttribute('transform', 'translate(' + xOffset + ', ' + legendH + ')');
      while (cloned.firstChild) gWrap.appendChild(cloned.firstChild);
      wrapper.appendChild(gWrap);

      // Bottom legend — vertical, one item per line, native SVG. No clipping,
      // no foreignObject. Each row: dot + label.
      if (bottom.length) {
        const baseY = legendH + origH + bottomPadT + bottomLineH / 2;
        bottom.forEach((it, idx) => {
          const cy = baseY + idx * bottomLineH;
          const cx = bottomPadL + bottomDotR;
          const dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('cx', cx);
          dot.setAttribute('cy', cy - 4);
          dot.setAttribute('r',  bottomDotR);
          dot.setAttribute('fill', it.color);
          wrapper.appendChild(dot);

          const text = document.createElementNS(NS, 'text');
          text.setAttribute('x', cx + bottomDotR + 8);
          text.setAttribute('y', cy);
          text.setAttribute('font-family', 'Arial, sans-serif');
          text.setAttribute('font-size', bottomFontPx);
          text.setAttribute('font-weight', '500');
          text.setAttribute('fill', '#475569');
          text.textContent = it.label;
          wrapper.appendChild(text);
        });
      }

      const xml = new XMLSerializer().serializeToString(wrapper);
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const img = new Image();
      const helpers = this; // for buildSinglePagePdf
      img.onload = function() {
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(finalW * scale);
        canvas.height = Math.round(newH   * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const jpgBytes = helpers._base64ToBytes(dataUrl.split(',')[1]);
        const pdfBytes = helpers._buildSinglePagePdf(jpgBytes, canvas.width, canvas.height, finalW, newH);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        const pdfName = (filename || 'chart').replace(/\.(png|jpg|jpeg|svg|pdf)$/i, '') + '.pdf';
        a.href = url; a.download = pdfName; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 200);
      };
      img.src = 'data:image/svg+xml;base64,' + svg64;
    },

    /* ============================================================
       Position a tooltip so it follows the cursor but never overflows
       the chart container's right or top edges. Pass the SVG element
       (or any container) and the mouse event; the tooltip is positioned
       12 px to the right of the cursor, or to the LEFT if that would
       push it off-screen. Works with any tooltip element that has
       `position: absolute`.
       ============================================================ */
    positionTooltip(tip, svgEl, e) {
      const rect = svgEl.getBoundingClientRect();
      const tipW = tip.offsetWidth  || 200;
      const tipH = tip.offsetHeight || 60;
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      // Default: tooltip to the right of the cursor
      let left = localX + 12;
      let top  = localY - 30;
      // Flip to left side if it would overflow the right edge
      if (left + tipW > rect.width - 4) {
        left = localX - tipW - 12;
      }
      // Clamp top so it doesn't go above the chart
      if (top < 4) top = 4;
      // Clamp top so it doesn't go below the chart
      if (top + tipH > rect.height - 4) top = rect.height - tipH - 4;
      // Clamp left so it doesn't go past the left edge
      if (left < 4) left = 4;
      tip.style.left = left + 'px';
      tip.style.top  = top  + 'px';
    },

    /* Decode base64 → Uint8Array (private helper). */
    _base64ToBytes(b64) {
      const bin = atob(b64);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    },

    /* Build a minimal single-page PDF (PDF-1.4) embedding a JPEG image
       that fills the page. Hand-written so we don't pull in a PDF library. */
    _buildSinglePagePdf(jpgBytes, imgW, imgH, pageW, pageH) {
      const enc = new TextEncoder();
      const objects = [];
      function addObject(body) { objects.push(body); return objects.length; }

      addObject('<< /Type /Catalog /Pages 2 0 R >>');                          // 1
      addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');                   // 2
      addObject(                                                                // 3
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pageW + ' ' + pageH + ']' +
        ' /Resources << /XObject << /Im0 5 0 R >> /ProcSet [/PDF /ImageC] >>' +
        ' /Contents 4 0 R >>'
      );
      const contentStr = 'q\n' + pageW + ' 0 0 ' + pageH + ' 0 0 cm\n/Im0 Do\nQ';
      addObject('<< /Length ' + enc.encode(contentStr).length + ' >>\nstream\n' + contentStr + '\nendstream'); // 4
      addObject({ image: true });                                               // 5

      const parts = [];
      const pushBytes = b => parts.push(b);
      const pushStr   = s => parts.push(enc.encode(s));

      pushStr('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

      const offsets = new Array(objects.length + 1).fill(0);
      let cursor = 0;
      for (const a of parts) cursor += a.byteLength;

      for (let i = 0; i < objects.length; i++) {
        offsets[i + 1] = cursor;
        const obj = objects[i];
        if (obj && obj.image) {
          const dictStr =
            (i + 1) + ' 0 obj\n' +
            '<< /Type /XObject /Subtype /Image /Width ' + imgW +
            ' /Height ' + imgH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8' +
            ' /Filter /DCTDecode /Length ' + jpgBytes.length + ' >>\nstream\n';
          const headBytes = enc.encode(dictStr);
          const tailBytes = enc.encode('\nendstream\nendobj\n');
          pushBytes(headBytes); pushBytes(jpgBytes); pushBytes(tailBytes);
          cursor += headBytes.length + jpgBytes.length + tailBytes.length;
        } else {
          const body = (i + 1) + ' 0 obj\n' + obj + '\nendobj\n';
          const bytes = enc.encode(body);
          pushBytes(bytes);
          cursor += bytes.length;
        }
      }

      const xrefOffset = cursor;
      let xref = 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
      for (let i = 1; i <= objects.length; i++) {
        xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
      }
      pushStr(xref);

      pushStr(
        'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\n' +
        'startxref\n' + xrefOffset + '\n%%EOF'
      );

      let total = 0;
      for (const a of parts) total += a.byteLength;
      const out = new Uint8Array(total);
      let off = 0;
      for (const a of parts) { out.set(a, off); off += a.byteLength; }
      return out;
    }
  };
})();
