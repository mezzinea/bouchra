/*
 * BOUCHRA — shared site runtime.
 * Loads the catalogue, renders the shared layout (header, footer, floating
 * WhatsApp button, My Selection drawer, size guide) and exposes the WhatsApp
 * ordering component as window.Bouchra. Requires js/i18n.js.
 */
(function () {
  'use strict';

  var I = window.BouchraI18n;
  var t = I.t;
  var tr = I.tr;

  var KEYS = {
    preview: 'bouchra_preview',
    draft: 'bouchra_admin_draft',
    selection: 'bouchra_selection'
  };

  // localStorage can be unavailable (private mode, files opened directly in
  // some browsers, strict privacy settings). Fall back to memory so My
  // Selection still works on the current page.
  var memory = {};
  var storage = {
    get: function (k) {
      try { var v = localStorage.getItem(k); if (v !== null) return v; } catch (e) { /* use memory */ }
      return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null;
    },
    set: function (k, v) {
      memory[k] = v;
      try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
    },
    remove: function (k) {
      delete memory[k];
      try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Catalogue ---------- */

  function loadCatalog() {
    if (storage.get(KEYS.preview) === '1') {
      var draft = storage.get(KEYS.draft);
      if (draft) {
        try { return { data: JSON.parse(draft), preview: true }; } catch (e) { /* fall through */ }
      }
    }
    return { data: window.BOUCHRA_CATALOG, preview: false };
  }

  var loaded = loadCatalog();
  var catalog = loaded.data;
  var settings = catalog.settings;

  function getProduct(id) {
    for (var i = 0; i < catalog.products.length; i++) {
      if (catalog.products[i].id === id) return catalog.products[i];
    }
    return null;
  }

  function getCategory(id) {
    for (var i = 0; i < catalog.categories.length; i++) {
      if (catalog.categories[i].id === id) return catalog.categories[i];
    }
    return null;
  }

  // Colours are identified by their English name, whatever the language.
  function colourId(colour) {
    return typeof colour.name === 'object' ? (colour.name.en || tr(colour.name)) : String(colour.name);
  }

  // Photos for a colour, falling back to the product's general photos.
  function imagesFor(product, id) {
    var match = (product.colours || []).filter(function (c) { return colourId(c) === id; })[0];
    if (match && match.images && match.images.length) return match.images;
    return product.images.length ? product.images : ['img/bouchra_icon.png'];
  }

  function colourName(product, id) {
    var match = (product.colours || []).filter(function (c) { return colourId(c) === id; })[0];
    return match ? tr(match.name) : id;
  }

  /* ---------- Formatting ---------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function hasPrice(price) {
    return price !== null && price !== undefined && price !== '' && !isNaN(Number(price));
  }

  function formatPrice(price) {
    if (!hasPrice(price)) return t('price.onRequest');
    var n = Number(price);
    var str = Number.isInteger(n) ? String(n) : n.toFixed(2);
    var parts = str.split('.');
    // No-break space: bidi keeps "1 290" as one number in Arabic (a plain space
    // would display it as "290 1").
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.') + ' ' + (tr(settings.currency) || 'MAD');
  }

  var AVAILABILITY_TONES = {
    'in-stock': 'ok',
    'low-stock': 'warn',
    'made-to-order': 'info',
    'out-of-stock': 'out'
  };

  function availability(key) {
    if (!AVAILABILITY_TONES[key]) key = 'in-stock';
    return { label: t('avail.' + key), tone: AVAILABILITY_TONES[key] };
  }

  /* ---------- WhatsApp ordering component ---------- */

  // Digits only, international format without "+" (e.g. 2126XXXXXXXX).
  function cleanNumber(raw) {
    var n = String(raw || '').replace(/\D/g, '');
    if (n.indexOf('00') === 0) n = n.slice(2);
    // Moroccan local format (06…, 07…, 05…) → 212…
    if (/^0[5-7]\d{8}$/.test(n)) n = '212' + n.slice(1);
    return n;
  }

  function isNumberConfigured() {
    return cleanNumber(settings.whatsappNumber).length >= 8;
  }

  // wa.me opens the app on mobile and WhatsApp Web / Desktop on computers.
  // Without a configured number, wa.me lets the visitor pick a chat instead.
  function waLink(message) {
    var number = isNumberConfigured() ? cleanNumber(settings.whatsappNumber) : '';
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
  }

  function generalMessage() {
    return tr(settings.generalMessage);
  }

  function productUrl(id) {
    var base = settings.siteUrl ? settings.siteUrl.replace(/\/?$/, '/') : window.location.href;
    try {
      return new URL('product.html?id=' + encodeURIComponent(id), base).href;
    } catch (e) {
      return 'product.html?id=' + encodeURIComponent(id);
    }
  }

  function productLines(product, sel) {
    return [
      t('msg.product') + ': ' + tr(product.name),
      t('msg.reference') + ': ' + (product.sku || '—'),
      t('msg.price') + ': ' + (hasPrice(product.price) ? formatPrice(product.price) : t('msg.onRequest')),
      t('msg.size') + ': ' + (sel.size || t('msg.toConfirm')),
      t('msg.colour') + ': ' + (sel.colour ? colourName(product, sel.colour) : t('msg.toConfirm')),
      t('msg.quantity') + ': ' + (sel.qty || 1),
      t('msg.url') + ': ' + productUrl(product.id)
    ];
  }

  function productMessage(product, sel) {
    return t('msg.productIntro', { brand: settings.brandName }) + '\n\n' +
      productLines(product, sel).join('\n') +
      '\n\n' + t('msg.outro');
  }

  function productQuestionMessage(product) {
    return t('msg.question', { brand: settings.brandName }) + '\n\n' +
      t('msg.product') + ': ' + tr(product.name) + '\n' +
      t('msg.reference') + ': ' + (product.sku || '—') + '\n' +
      t('msg.url') + ': ' + productUrl(product.id) + '\n\n';
  }

  function selectionMessage(items) {
    var blocks = [];
    var total = 0;
    var allPriced = true;
    items.forEach(function (item, i) {
      var product = getProduct(item.id);
      if (!product) return;
      blocks.push((i + 1) + '.\n' + productLines(product, item).join('\n'));
      if (hasPrice(product.price)) total += Number(product.price) * item.qty;
      else allPriced = false;
    });
    var msg = t('msg.productsIntro', { brand: settings.brandName }) + '\n\n' + blocks.join('\n\n');
    if (allPriced && blocks.length) {
      msg += '\n\n' + t('msg.total') + ': ' + formatPrice(total);
    }
    return msg + '\n\n' + t('msg.outro');
  }

  /* ---------- My Selection (request list) ---------- */

  var selection = {
    items: function () {
      var raw = storage.get(KEYS.selection);
      var items = [];
      try { items = raw ? JSON.parse(raw) : []; } catch (e) { items = []; }
      return Array.isArray(items) ? items.filter(function (it) { return getProduct(it.id); }) : [];
    },
    save: function (items) {
      storage.set(KEYS.selection, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('bouchra:selection'));
    },
    add: function (entry) {
      var items = this.items();
      var existing = items.filter(function (it) {
        return it.id === entry.id && it.size === entry.size && it.colour === entry.colour;
      })[0];
      if (existing) existing.qty = Math.min(20, existing.qty + entry.qty);
      else items.push({ id: entry.id, size: entry.size, colour: entry.colour, qty: entry.qty });
      this.save(items);
    },
    update: function (index, patch) {
      var items = this.items();
      if (!items[index]) return;
      Object.keys(patch).forEach(function (k) { items[index][k] = patch[k]; });
      this.save(items);
    },
    remove: function (index) {
      var items = this.items();
      items.splice(index, 1);
      this.save(items);
    },
    clear: function () { this.save([]); },
    count: function () {
      return this.items().reduce(function (sum, it) { return sum + it.qty; }, 0);
    }
  };

  /* ---------- Icons ---------- */

  var ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.030-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>'
  };

  /* ---------- Shared components ---------- */

  function productCard(p) {
    var cat = getCategory(p.category);
    var avail = availability(p.availability);
    var name = tr(p.name);
    var badges = [];
    if (p.availability === 'out-of-stock') badges.push('<span class="badge badge--out">' + esc(t('badge.soldOut')) + '</span>');
    else if (p.newArrival) badges.push('<span class="badge">' + esc(t('badge.new')) + '</span>');
    if (p.bestSeller && p.availability !== 'out-of-stock') badges.push('<span class="badge badge--dark">' + esc(t('badge.best')) + '</span>');
    var img1 = p.images[0] || 'img/bouchra_icon.png';
    var img2 = p.images[1];
    var swatches = (p.colours || []).slice(0, 4).map(function (c) {
      return '<span class="dot" style="background:' + esc(c.hex) + '" title="' + esc(tr(c.name)) + '"></span>';
    }).join('');
    return '' +
      '<article class="card">' +
        '<a class="card__media" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
          '<img src="' + esc(img1) + '" alt="' + esc(name) + '" loading="lazy">' +
          (img2 ? '<img class="card__alt" src="' + esc(img2) + '" alt="" loading="lazy">' : '') +
          '<span class="card__badges">' + badges.join('') + '</span>' +
        '</a>' +
        '<div class="card__body">' +
          '<p class="card__cat">' + esc(cat ? tr(cat.name) : '') + '</p>' +
          '<h3 class="card__name"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(name) + '</a></h3>' +
          '<p class="card__price">' + esc(formatPrice(p.price)) + '</p>' +
          '<div class="card__meta"><span class="dots">' + swatches + '</span>' +
            (p.availability === 'low-stock' ? '<span class="card__avail">' + esc(avail.label) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function langSwitch(extraClass) {
    return '<div class="lang-switch ' + (extraClass || '') + '" role="group" aria-label="' + esc(t('lang.label')) + '">' +
      I.languages.map(function (l) {
        return '<button type="button" data-set-lang="' + l.code + '" lang="' + l.code + '" title="' + esc(l.name) + '"' +
          (l.code === I.lang ? ' aria-current="true"' : '') + '>' + esc(l.label) + '</button>';
      }).join('') +
    '</div>';
  }

  function renderHeader() {
    var mount = document.querySelector('[data-site-header]');
    if (!mount) return;
    var page = document.body.getAttribute('data-page');
    function navLink(href, key, pageKey) {
      return '<a href="' + href + '"' + (page === pageKey ? ' aria-current="page"' : '') + '>' + esc(t(key)) + '</a>';
    }
    var preview = loaded.preview
      ? '<div class="preview-bar">' + esc(t('preview.text')) + ' <button type="button" data-exit-preview>' + esc(t('preview.exit')) + '</button></div>'
      : '';
    var announcement = tr(settings.homepage.announcement);
    // The logo comes first so it sits at the start of the reading direction:
    // left in English/French, right in Arabic.
    mount.outerHTML = preview +
      (announcement ? '<div class="announce">' + esc(announcement) + '</div>' : '') +
      '<header class="site-header">' +
        '<div class="site-header__inner">' +
          '<a class="brand" href="index.html" aria-label="' + esc(t('a11y.home')) + '"><img src="img/bouchra_full_logo.png" alt="BOUCHRA Modest Fashion"></a>' +
          '<nav class="site-nav" id="site-nav" aria-label="' + esc(t('nav.main')) + '">' +
            navLink('collection.html', 'nav.collections', 'collection') +
            navLink('collection.html?filter=new', 'nav.new', 'new') +
            navLink('collection.html?filter=best', 'nav.best', 'best') +
            '<a href="#" data-open-size-guide>' + esc(t('nav.sizeGuide')) + '</a>' +
            navLink('index.html#about', 'nav.story', 'about') +
            langSwitch('lang-switch--menu') +
          '</nav>' +
          '<div class="site-header__actions">' +
            langSwitch('lang-switch--bar') +
            '<a class="icon-btn header-wa" href="' + esc(waLink(generalMessage())) + '" target="_blank" rel="noopener" aria-label="' + esc(t('a11y.chat')) + '">' + ICONS.whatsapp + '</a>' +
            '<button class="selection-btn" type="button" data-open-selection aria-label="' + esc(t('a11y.openSelection')) + '">' +
              ICONS.bag + '<span class="selection-btn__label">' + esc(t('sel.title')) + '</span><span class="count" data-selection-count>0</span>' +
            '</button>' +
            '<button class="icon-btn nav-toggle" type="button" aria-label="' + esc(t('a11y.openMenu')) + '" aria-controls="site-nav" aria-expanded="false" data-nav-toggle>' + ICONS.menu + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function renderFooter() {
    var mount = document.querySelector('[data-site-footer]');
    if (!mount) return;
    var cats = catalog.categories.map(function (c) {
      return '<li><a href="collection.html?category=' + encodeURIComponent(c.id) + '">' + esc(tr(c.name)) + '</a></li>';
    }).join('');
    mount.outerHTML = '' +
      '<footer class="site-footer">' +
        '<div class="motif-band motif-band--light"></div>' +
        '<div class="container site-footer__grid">' +
          '<div class="site-footer__brand">' +
            '<img src="img/site/logo-ivory.png" alt="BOUCHRA Modest Fashion" width="180">' +
            '<p>' + esc(t('footer.tagline')) + '</p>' +
          '</div>' +
          '<div><h4>' + esc(t('footer.collections')) + '</h4><ul>' + cats + '</ul></div>' +
          '<div><h4>' + esc(t('footer.howTo')) + '</h4><ul>' +
            '<li>' + esc(t('footer.step1')) + '</li>' +
            '<li>' + esc(t('footer.step2')) + '</li>' +
            '<li>' + esc(t('footer.step3')) + '</li>' +
          '</ul></div>' +
          '<div><h4>' + esc(t('footer.contact')) + '</h4>' +
            '<a class="btn btn--wa-light" href="' + esc(waLink(generalMessage())) + '" target="_blank" rel="noopener">' + ICONS.whatsapp + esc(t('footer.chat')) + '</a>' +
            '<p class="small">' + esc(t('footer.noPayment')) + '</p>' +
            langSwitch('lang-switch--footer') +
          '</div>' +
        '</div>' +
        '<div class="container site-footer__base"><span>© ' + new Date().getFullYear() + ' BOUCHRA Modest Fashion</span><span>' + esc(t('footer.motto')) + '</span></div>' +
      '</footer>';
  }

  function renderFloatingButton() {
    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = waLink(generalMessage());
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', t('float.label'));
    a.innerHTML = ICONS.whatsapp + '<span class="wa-float__tip">' + esc(t('float.tip')) + '</span>';
    document.body.appendChild(a);
  }

  /* ---------- Size guide dialog ---------- */

  function renderSizeGuide() {
    var g = catalog.sizeGuide;
    var dlg = document.createElement('dialog');
    dlg.className = 'modal';
    dlg.id = 'size-guide';
    dlg.setAttribute('aria-labelledby', 'size-guide-title');
    dlg.innerHTML = '' +
      '<div class="modal__head"><h2 id="size-guide-title">' + esc(t('sg.title')) + '</h2>' +
        '<button class="icon-btn" type="button" aria-label="' + esc(t('sg.close')) + '" data-close-modal>' + ICONS.close + '</button></div>' +
      '<div class="table-wrap"><table class="size-table"><thead><tr>' +
        g.columns.map(function (c) { return '<th scope="col">' + esc(tr(c)) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
        g.rows.map(function (r) {
          return '<tr>' + r.map(function (cell, i) {
            return i === 0 ? '<th scope="row">' + esc(cell) + '</th>' : '<td>' + esc(cell) + '</td>';
          }).join('') + '</tr>';
        }).join('') +
      '</tbody></table></div>' +
      '<p class="small">' + esc(tr(g.note)) + '</p>' +
      '<a class="btn btn--outline btn--block" target="_blank" rel="noopener" href="' +
        esc(waLink(t('msg.sizing', { brand: settings.brandName }))) + '">' +
        ICONS.whatsapp + esc(t('sg.ask')) + '</a>';
    document.body.appendChild(dlg);
  }

  function openSizeGuide() {
    var dlg = document.getElementById('size-guide');
    if (dlg && dlg.showModal) dlg.showModal();
  }

  /* ---------- My Selection drawer ---------- */

  function renderDrawer() {
    var wrap = document.createElement('div');
    wrap.innerHTML = '' +
      '<div class="drawer-scrim" data-close-selection hidden></div>' +
      '<aside class="drawer" id="selection-drawer" aria-label="' + esc(t('sel.title')) + '" aria-hidden="true" tabindex="-1">' +
        '<div class="drawer__head"><h2>' + esc(t('sel.title')) + '</h2>' +
          '<button class="icon-btn" type="button" aria-label="' + esc(t('sel.close')) + '" data-close-selection>' + ICONS.close + '</button></div>' +
        '<div class="drawer__body" data-selection-list></div>' +
        '<div class="drawer__foot" data-selection-foot></div>' +
      '</aside>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  function optionList(options, current) {
    return options.map(function (o) {
      return '<option value="' + esc(o.value) + '"' + (o.value === current ? ' selected' : '') + '>' + esc(o.label) + '</option>';
    }).join('');
  }

  function updateSelectionUI() {
    var items = selection.items();
    var count = items.reduce(function (s, it) { return s + it.qty; }, 0);
    document.querySelectorAll('[data-selection-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
    });

    var list = document.querySelector('[data-selection-list]');
    var foot = document.querySelector('[data-selection-foot]');
    if (!list) return;

    if (!items.length) {
      list.innerHTML = '' +
        '<div class="drawer__empty">' +
          '<img src="img/bouchra_icon.png" alt="" width="56">' +
          '<p>' + esc(t('sel.empty')) + '</p>' +
          '<p class="small">' + esc(t('sel.emptyText')) + '</p>' +
          '<a class="btn btn--outline" href="collection.html">' + esc(t('sel.explore')) + '</a>' +
        '</div>';
      foot.innerHTML = '';
      return;
    }

    var total = 0;
    var allPriced = true;
    list.innerHTML = items.map(function (it, i) {
      var p = getProduct(it.id);
      var name = tr(p.name);
      if (hasPrice(p.price)) total += Number(p.price) * it.qty; else allPriced = false;
      var sizeOptions = (p.sizes || []).map(function (s) { return { value: s, label: s }; });
      var colourOptions = (p.colours || []).map(function (c) { return { value: colourId(c), label: tr(c.name) }; });
      return '' +
        '<div class="sel-item" data-index="' + i + '">' +
          '<a href="product.html?id=' + encodeURIComponent(p.id) + '&amp;colour=' + encodeURIComponent(it.colour || '') + '" class="sel-item__img"><img src="' + esc(imagesFor(p, it.colour)[0]) + '" alt=""></a>' +
          '<div class="sel-item__info">' +
            '<div class="sel-item__top"><div><p class="sel-item__name">' + esc(name) + '</p>' +
              '<p class="small">' + esc(t('sel.ref')) + ' ' + esc(p.sku) + ' · ' + esc(formatPrice(p.price)) + '</p></div>' +
              '<button class="icon-btn icon-btn--sm" type="button" data-sel-remove aria-label="' + esc(t('sel.remove', { name: name })) + '">' + ICONS.trash + '</button></div>' +
            '<div class="sel-item__opts">' +
              '<label><span>' + esc(t('sel.size')) + '</span><select data-sel-field="size">' + optionList(sizeOptions, it.size) + '</select></label>' +
              '<label><span>' + esc(t('sel.colour')) + '</span><select data-sel-field="colour">' + optionList(colourOptions, it.colour) + '</select></label>' +
              '<div class="qty qty--sm" role="group" aria-label="' + esc(t('sel.qty')) + '">' +
                '<button type="button" data-sel-qty="-1" aria-label="' + esc(t('sel.dec')) + '">' + ICONS.minus + '</button>' +
                '<span aria-live="polite">' + it.qty + '</span>' +
                '<button type="button" data-sel-qty="1" aria-label="' + esc(t('sel.inc')) + '">' + ICONS.plus + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    foot.innerHTML = '' +
      (allPriced ? '<div class="drawer__total"><span>' + esc(t('sel.total')) + '</span><strong>' + esc(formatPrice(total)) + '</strong></div>' : '') +
      '<p class="small">' + esc(t('sel.note')) + '</p>' +
      '<a class="btn btn--wa btn--block btn--lg" target="_blank" rel="noopener" href="' + esc(waLink(selectionMessage(items))) + '">' +
        ICONS.whatsapp + esc(t('sel.send')) + '</a>' +
      '<button class="link-btn" type="button" data-sel-clear>' + esc(t('sel.clear')) + '</button>';
  }

  var lastFocus = null;

  function openSelection() {
    var drawer = document.getElementById('selection-drawer');
    lastFocus = document.activeElement;
    document.querySelector('.drawer-scrim').hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    drawer.focus();
  }

  function closeSelection() {
    var drawer = document.getElementById('selection-drawer');
    if (!drawer.classList.contains('is-open')) return;
    document.querySelector('.drawer-scrim').hidden = true;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- Toast ---------- */

  var toastTimer;
  function toast(html) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.innerHTML = html;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 3800);
  }

  /* ---------- Events ---------- */

  function bindEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      var langBtn = t.closest('[data-set-lang]');
      if (langBtn) { I.setLang(langBtn.getAttribute('data-set-lang')); return; }
      if (t.closest('[data-open-selection]')) { e.preventDefault(); openSelection(); return; }
      if (t.closest('[data-close-selection]')) { closeSelection(); return; }
      if (t.closest('[data-open-size-guide]')) { e.preventDefault(); openSizeGuide(); return; }
      if (t.closest('[data-close-modal]')) { t.closest('dialog').close(); return; }
      if (t.matches('dialog.modal')) { t.close(); return; } // click on backdrop
      if (t.closest('[data-exit-preview]')) { storage.remove(KEYS.preview); window.location.reload(); return; }

      var toggle = t.closest('[data-nav-toggle]');
      if (toggle) {
        var open = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(open));
        return;
      }

      var item = t.closest('.sel-item');
      if (item) {
        var index = Number(item.getAttribute('data-index'));
        if (t.closest('[data-sel-remove]')) { selection.remove(index); return; }
        var q = t.closest('[data-sel-qty]');
        if (q) {
          var current = selection.items()[index].qty;
          var next = Math.max(1, Math.min(20, current + Number(q.getAttribute('data-sel-qty'))));
          selection.update(index, { qty: next });
        }
      }
      if (t.closest('[data-sel-clear]')) selection.clear();
    });

    document.addEventListener('change', function (e) {
      var field = e.target.getAttribute('data-sel-field');
      if (!field) return;
      var index = Number(e.target.closest('.sel-item').getAttribute('data-index'));
      var patch = {};
      patch[field] = e.target.value;
      selection.update(index, patch);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSelection();
    });

    document.addEventListener('bouchra:selection', updateSelectionUI);

    // Keep the badge in sync across tabs.
    window.addEventListener('storage', function (e) {
      if (e.key === KEYS.selection) updateSelectionUI();
    });
  }

  function init() {
    I.applyStatic();
    renderHeader();
    renderFooter();
    renderFloatingButton();
    renderSizeGuide();
    renderDrawer();
    bindEvents();
    updateSelectionUI();
    if (!isNumberConfigured() && window.console) {
      console.warn('BOUCHRA: no WhatsApp number configured. Set settings.whatsappNumber in data/catalog.js or via admin.html.');
    }
  }

  window.Bouchra = {
    catalog: catalog,
    settings: settings,
    t: t,
    tr: tr,
    isRtl: I.isRtl,
    getProduct: getProduct,
    getCategory: getCategory,
    colourId: colourId,
    colourName: colourName,
    imagesFor: imagesFor,
    esc: esc,
    formatPrice: formatPrice,
    availability: availability,
    productCard: productCard,
    icons: ICONS,
    whatsapp: {
      cleanNumber: cleanNumber,
      isConfigured: isNumberConfigured,
      link: waLink,
      generalMessage: generalMessage,
      productMessage: productMessage,
      productQuestionMessage: productQuestionMessage,
      selectionMessage: selectionMessage
    },
    selection: selection,
    openSelection: openSelection,
    openSizeGuide: openSizeGuide,
    toast: toast
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
