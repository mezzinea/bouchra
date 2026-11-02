/*
 * BOUCHRA — catalogue manager.
 *
 * The site is static, so edits are kept as a draft in this browser.
 * "Preview site" shows the draft on the real pages; "Download catalog.js"
 * exports it so it can replace data/catalog.js on the hosting.
 *
 * Customer-facing text is stored as { en, fr, ar }; English is required and
 * is used wherever a translation is left empty.
 */
(function () {
  'use strict';

  var KEYS = { preview: 'bouchra_preview', draft: 'bouchra_admin_draft' };
  var LANGS = [
    { code: 'en', label: 'EN', dir: 'ltr' },
    { code: 'fr', label: 'FR', dir: 'ltr' },
    { code: 'ar', label: 'AR', dir: 'rtl' }
  ];
  var AVAILABILITY = [
    ['in-stock', 'In stock'],
    ['low-stock', 'Only a few left'],
    ['made-to-order', 'Made to order'],
    ['out-of-stock', 'Sold out']
  ];
  var COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One size'];

  var panel = document.querySelector('[data-panel]');
  var statusEl = document.querySelector('[data-status]');
  var importInput = document.querySelector('[data-import-input]');

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Keep in sync with cleanNumber() in js/app.js.
  function cleanNumber(raw) {
    var n = String(raw || '').replace(/\D/g, '');
    if (n.indexOf('00') === 0) n = n.slice(2);
    if (/^0[5-7]\d{8}$/.test(n)) n = '212' + n.slice(1);
    return n;
  }

  function slugify(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'product';
  }

  // Translatable values: plain strings (older data) become { en, fr, ar }.
  function loc(value) {
    if (value && typeof value === 'object') return value;
    return { en: value == null ? '' : String(value), fr: '', ar: '' };
  }

  function en(value) {
    var v = loc(value);
    return v.en || v.fr || v.ar || '';
  }

  /* ---------- Draft storage ---------- */

  var published = clone(window.BOUCHRA_CATALOG);
  var data = clone(published);
  var storageOk = true;

  try {
    var saved = localStorage.getItem(KEYS.draft);
    if (saved) data = JSON.parse(saved);
  } catch (e) {
    storageOk = false;
  }

  function isDirty() {
    return JSON.stringify(data) !== JSON.stringify(published);
  }

  function persist() {
    try {
      localStorage.setItem(KEYS.draft, JSON.stringify(data));
    } catch (e) {
      alert('Could not save the draft in this browser. It is probably too large: uploaded photos are stored inside the draft. ' +
        'Remove some uploaded photos or use image paths (e.g. img/products/name.jpg) instead.');
    }
    updateStatus();
  }

  function updateStatus() {
    var dirty = isDirty();
    statusEl.textContent = !storageOk
      ? 'Browser storage unavailable — changes will be lost on reload'
      : dirty ? 'Unpublished changes (draft saved in this browser)' : 'Matches published catalogue';
    statusEl.classList.toggle('admin-status--dirty', dirty);
  }

  /* ---------- Tabs ---------- */

  var currentTab = 'products';
  var editing = null; // { index, product, idTouched }

  document.querySelector('.admin-tabs').addEventListener('click', function (e) {
    var tab = e.target.closest('[data-tab]');
    if (!tab) return;
    if (editing && !confirm('Leave the product editor? Unsaved changes to this product will be lost.')) return;
    editing = null;
    currentTab = tab.getAttribute('data-tab');
    document.querySelectorAll('[data-tab]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b === tab));
    });
    render();
  });

  function render() {
    if (editing) return renderEditor();
    ({ products: renderProducts, settings: renderSettings, homepage: renderHomepage, sizes: renderSizeGuide, publish: renderPublish })[currentTab]();
    window.scrollTo(0, 0);
  }

  function categoryName(id) {
    var c = data.categories.filter(function (c) { return c.id === id; })[0];
    return c ? en(c.name) : id;
  }

  function priceLabel(p) {
    return p.price === null || p.price === '' || p.price === undefined
      ? 'On request' : Number(p.price).toLocaleString('fr-FR') + ' ' + (en(data.settings.currency) || 'MAD');
  }

  /* ---------- Form helpers ---------- */

  function field(label, control, help, full) {
    return '<label class="field' + (full ? ' full' : '') + '"><span>' + label + '</span>' + control +
      (help ? '<small>' + help + '</small>' : '') + '</label>';
  }

  // One input per language. `attrs` identifies the value (e.g. 'data-pf="name"').
  function locField(label, attrs, value, opts) {
    opts = opts || {};
    var v = loc(value);
    var inputs = LANGS.map(function (l) {
      var common = attrs + ' data-lang="' + l.code + '" dir="' + l.dir + '" lang="' + l.code + '"' +
        (l.code === 'en' && opts.required ? ' required' : '') +
        ' placeholder="' + (l.code === 'en' ? (opts.placeholder || '') : 'Same as English if empty') + '"';
      var control = opts.multiline
        ? '<textarea ' + common + (opts.rows ? ' style="min-height:' + opts.rows + 'px"' : '') + '>' + esc(v[l.code]) + '</textarea>'
        : '<input type="text" ' + common + ' value="' + esc(v[l.code]) + '">';
      return '<label class="loc__item"><em>' + l.label + '</em>' + control + '</label>';
    }).join('');
    return '<div class="field loc' + (opts.half ? '' : ' full') + (opts.multiline ? ' loc--stack' : '') + '"><span>' + label + '</span>' +
      '<div class="loc__grid">' + inputs + '</div>' +
      (opts.help ? '<small>' + opts.help + '</small>' : '') + '</div>';
  }

  function setLoc(obj, key, lang, value) {
    obj[key] = loc(obj[key]);
    obj[key][lang] = value;
  }

  /* ---------- Products list ---------- */

  var search = '';

  function renderProducts() {
    var warn = cleanNumber(data.settings.whatsappNumber).length < 8
      ? '<div class="callout callout--warn">No WhatsApp business number is configured yet. Customers can still send requests, but WhatsApp will ask them to choose a contact. <button type="button" class="link-btn" data-goto="settings">Add the number</button></div>'
      : '';
    panel.innerHTML = '' +
      warn +
      '<div class="admin-head"><div><h1>Products</h1><p>' + data.products.length + ' products in the catalogue.</p></div>' +
        '<button type="button" class="abtn" data-action="new-product">+ Add product</button></div>' +
      '<div class="list-tools"><input type="search" placeholder="Search by name or reference…" value="' + esc(search) + '" data-search aria-label="Search products"></div>' +
      '<table class="plist"><thead><tr><th></th><th>Product</th><th>Collection</th><th>Price</th><th>Availability</th><th>Tags</th><th></th></tr></thead>' +
      '<tbody data-rows></tbody></table>';
    renderRows();
  }

  function missingTranslations(p) {
    return ['fr', 'ar'].filter(function (l) { return !loc(p.name)[l] || !loc(p.description)[l]; });
  }

  function renderRows() {
    var q = search.trim().toLowerCase();
    var rows = data.products.map(function (p, i) { return { p: p, i: i }; }).filter(function (r) {
      var n = loc(r.p.name);
      var hay = [n.en, n.fr, n.ar, r.p.sku].join(' ').toLowerCase();
      return !q || hay.indexOf(q) > -1;
    });
    var tbody = panel.querySelector('[data-rows]');
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="small" style="text-align:center;padding:32px">No products found.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(function (r) {
      var p = r.p;
      var avail = AVAILABILITY.filter(function (a) { return a[0] === p.availability; })[0];
      var missing = missingTranslations(p);
      return '' +
        '<tr>' +
          '<td><img class="plist__thumb" src="' + esc(p.images[0] || 'img/bouchra_icon.png') + '" alt=""></td>' +
          '<td><div class="plist__name">' + esc(en(p.name)) + '</div><div class="small">' + esc(p.sku) +
            (missing.length ? ' · <span class="missing">Missing ' + missing.join(' & ').toUpperCase() + '</span>' : '') + '</div></td>' +
          '<td>' + esc(categoryName(p.category)) + '</td>' +
          '<td>' + esc(priceLabel(p)) + '</td>' +
          '<td>' + esc(avail ? avail[1] : p.availability) + '</td>' +
          '<td><div class="plist__flags">' +
            (p.newArrival ? '<span class="badge">New</span>' : '') +
            (p.bestSeller ? '<span class="badge badge--dark">Best seller</span>' : '') +
          '</div></td>' +
          '<td><div class="plist__actions">' +
            '<button type="button" class="abtn abtn--sm" data-edit="' + r.i + '">Edit</button>' +
            '<button type="button" class="abtn abtn--sm abtn--outline" data-duplicate="' + r.i + '">Duplicate</button>' +
            '<button type="button" class="abtn abtn--sm abtn--danger" data-delete="' + r.i + '">Delete</button>' +
          '</div></td>' +
        '</tr>';
    }).join('');
  }

  /* ---------- Product editor ---------- */

  function blankProduct() {
    return {
      id: '', sku: '', name: loc(''), category: data.categories[0].id, price: null,
      description: loc(''), fabric: loc(''), care: loc(''), sizes: ['S', 'M', 'L', 'XL'],
      colours: [{ name: { en: 'Sand', fr: 'Sable', ar: 'رملي' }, hex: '#D4B89C' }], images: [],
      availability: 'in-stock', newArrival: true, bestSeller: false
    };
  }

  function openEditor(index, product) {
    editing = { index: index, product: product, idTouched: index > -1 };
    render();
  }

  function renderEditor() {
    var p = editing.product;
    var isNew = editing.index === -1;
    var customSizes = p.sizes.filter(function (s) { return COMMON_SIZES.indexOf(s) === -1; });

    panel.innerHTML = '' +
      '<div class="admin-head"><div><h1>' + (isNew ? 'New product' : esc(en(p.name) || 'Edit product')) + '</h1>' +
        '<p>Changes are applied to the draft when you press “Save product”.</p></div>' +
        (isNew ? '' : '<a class="abtn abtn--outline" target="_blank" rel="noopener" href="product.html?id=' + encodeURIComponent(p.id) + '">View on site</a>') +
      '</div>' +

      '<section class="panel"><h2>Details</h2><p class="small">Name, reference, collection and price. English is required; French and Arabic fall back to English when empty.</p>' +
        '<div class="form-grid">' +
          locField('Product name *', 'data-pf="name"', p.name, { required: true }) +
          field('Reference / SKU *', '<input type="text" data-f="sku" value="' + esc(p.sku) + '" placeholder="BCH-AB-004" required>') +
          field('Collection', '<select data-f="category">' + data.categories.map(function (c) {
            return '<option value="' + esc(c.id) + '"' + (c.id === p.category ? ' selected' : '') + '>' + esc(en(c.name)) + '</option>';
          }).join('') + '</select>') +
          field('Price (MAD)', '<input type="number" min="0" step="1" data-f="price" value="' + (p.price === null || p.price === undefined ? '' : esc(p.price)) + '" placeholder="Leave empty for “Price on request”">') +
          field('Availability', '<select data-f="availability">' + AVAILABILITY.map(function (a) {
            return '<option value="' + a[0] + '"' + (a[0] === p.availability ? ' selected' : '') + '>' + a[1] + '</option>';
          }).join('') + '</select>') +
          field('Web address (ID)', '<input type="text" data-f="id" value="' + esc(p.id) + '">',
            'Used in the product link: product.html?id=<strong data-id-preview>' + esc(p.id) + '</strong>. Changing it breaks links already shared.', true) +
          '<div class="field full"><span>Highlights</span><div class="checks">' +
            '<label class="check"><input type="checkbox" data-f="newArrival"' + (p.newArrival ? ' checked' : '') + '> New arrival</label>' +
            '<label class="check"><input type="checkbox" data-f="bestSeller"' + (p.bestSeller ? ' checked' : '') + '> Best seller</label>' +
          '</div></div>' +
        '</div>' +
      '</section>' +

      '<section class="panel"><h2>Description</h2><p class="small">Shown on the product page.</p>' +
        '<div class="form-grid">' +
          locField('Description', 'data-pf="description"', p.description, { multiline: true }) +
          locField('Fabric & materials', 'data-pf="fabric"', p.fabric, { multiline: true, rows: 64 }) +
          locField('Care instructions', 'data-pf="care"', p.care, { multiline: true, rows: 64 }) +
        '</div>' +
      '</section>' +

      '<section class="panel"><h2>Photos</h2>' +
        '<p class="small">The first photo is the main image. Use the arrows to reorder. ' +
        'Tip: for the fastest site, upload photos to <code>img/products/</code> on your hosting and add them by path. ' +
        'Uploaded files are compressed and stored inside the catalogue file.</p>' +
        '<div class="img-grid" data-images></div>' +
        '<div class="img-add">' +
          '<label class="abtn upload-label">Upload photos<input type="file" accept="image/*" multiple data-upload></label>' +
          '<input type="text" placeholder="or image path, e.g. img/products/nour-abaya-2.jpg" data-img-path aria-label="Image path">' +
          '<button type="button" class="abtn abtn--outline" data-add-path>Add path</button>' +
        '</div>' +
      '</section>' +

      '<section class="panel"><h2>Sizes</h2><p class="small">Tick the sizes available for this piece.</p>' +
        '<div class="size-chips">' + COMMON_SIZES.map(function (s) {
          return '<label class="size-chip"><input type="checkbox" data-size-check value="' + esc(s) + '"' + (p.sizes.indexOf(s) > -1 ? ' checked' : '') + '> ' + esc(s) + '</label>';
        }).join('') + '</div>' +
        field('Other sizes (comma separated)', '<input type="text" data-custom-sizes value="' + esc(customSizes.join(', ')) + '" placeholder="e.g. 36, 38, 40">') +
      '</section>' +

      '<section class="panel"><h2>Colours</h2><p class="small">Name each colour in every language, as customers will see it in their WhatsApp message. The English name identifies the colour, so avoid changing it on live products. ' +
        'Add photos to a colour to show them when a customer selects it.</p>' +
        '<div class="colour-head"><span></span><span>English</span><span>Français</span><span>العربية</span><span>Hex</span><span></span></div>' +
        '<div data-colours></div>' +
        '<button type="button" class="abtn abtn--outline abtn--sm" data-add-colour>+ Add colour</button>' +
      '</section>' +

      '<div class="editor-foot">' +
        '<button type="button" class="abtn abtn--outline" data-action="cancel-edit">Cancel</button>' +
        '<div>' + (isNew ? '' : '<button type="button" class="abtn abtn--danger" data-delete="' + editing.index + '">Delete</button>') +
        '<button type="button" class="abtn" data-action="save-product">Save product</button></div>' +
      '</div>';

    renderImages();
    renderColours();
    window.scrollTo(0, 0);
  }

  function renderImages() {
    var imgs = editing.product.images;
    var box = panel.querySelector('[data-images]');
    if (!imgs.length) {
      box.innerHTML = '<p class="small">No photos yet.</p>';
      return;
    }
    box.innerHTML = imgs.map(function (src, i) {
      return '<div class="img-item">' +
        (i === 0 ? '<span class="badge badge--dark img-item__main">Main</span>' : '') +
        '<img src="' + esc(src) + '" alt="Photo ' + (i + 1) + '">' +
        '<div class="img-item__bar">' +
          '<button type="button" data-img-move="' + i + '" data-dir="-1" aria-label="Move photo left"' + (i === 0 ? ' disabled' : '') + '>←</button>' +
          '<button type="button" data-img-remove="' + i + '" aria-label="Remove photo">✕</button>' +
          '<button type="button" data-img-move="' + i + '" data-dir="1" aria-label="Move photo right"' + (i === imgs.length - 1 ? ' disabled' : '') + '>→</button>' +
        '</div></div>';
    }).join('');
  }

  function renderColours() {
    var box = panel.querySelector('[data-colours]');
    box.innerHTML = editing.product.colours.map(function (c, i) {
      var n = loc(c.name);
      return '<div class="colour-row" data-colour-row="' + i + '">' +
        '<input type="color" value="' + esc(c.hex) + '" data-colour-hex aria-label="Colour swatch">' +
        LANGS.map(function (l) {
          return '<input type="text" class="cell" value="' + esc(n[l.code]) + '" data-colour-name="' + l.code + '" dir="' + l.dir + '" lang="' + l.code + '"' +
            ' placeholder="' + (l.code === 'en' ? 'Colour name' : l.label) + '" aria-label="Colour name (' + l.label + ')">';
        }).join('') +
        '<input type="text" class="cell hex" value="' + esc(c.hex) + '" data-colour-hex-text aria-label="Hex code">' +
        '<button type="button" class="abtn abtn--sm abtn--danger" data-colour-remove aria-label="Remove colour">✕</button>' +
        '<div class="colour-imgs">' +
          (c.images || []).map(function (src, k) {
            return '<span class="colour-imgs__item"><img src="' + esc(src) + '" alt=""><button type="button" data-cimg-remove="' + k + '" aria-label="Remove photo">✕</button></span>';
          }).join('') +
          '<label class="abtn abtn--sm abtn--outline upload-label">+ Photos<input type="file" accept="image/*" multiple data-cimg-upload></label>' +
          '<input type="text" class="cell" placeholder="or path, e.g. img/products/nour-black-1.jpg" data-cimg-path aria-label="Colour photo path">' +
          '<button type="button" class="abtn abtn--sm abtn--outline" data-cimg-add>Add</button>' +
          (c.images && c.images.length ? '' : '<span class="small">No photos: the general product photos are shown.</span>') +
        '</div>' +
      '</div>';
    }).join('') || '<p class="small">No colours. Add at least one so customers can choose.</p>';
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1400;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not read ' + file.name)); };
      img.src = url;
    });
  }

  function collectSizes() {
    var sizes = [];
    panel.querySelectorAll('[data-size-check]:checked').forEach(function (c) { sizes.push(c.value); });
    panel.querySelector('[data-custom-sizes]').value.split(',').forEach(function (s) {
      s = s.trim();
      if (s && sizes.indexOf(s) === -1) sizes.push(s);
    });
    return sizes;
  }

  function saveProduct() {
    var p = editing.product;
    p.sizes = collectSizes();
    p.colours = p.colours.filter(function (c) { return en(c.name).trim(); });
    p.colours.forEach(function (c) { c.name = loc(c.name); if (!c.name.en) c.name.en = en(c.name); });
    p.name = loc(p.name);
    ['en', 'fr', 'ar'].forEach(function (l) { p.name[l] = (p.name[l] || '').trim(); });
    p.sku = p.sku.trim();
    p.id = slugify(p.id || p.name.en);

    var errors = [];
    if (!p.name.en) errors.push('Add the product name in English.');
    if (!p.sku) errors.push('Add a reference / SKU.');
    var clash = data.products.some(function (o, i) { return i !== editing.index && o.id === p.id; });
    if (clash) errors.push('Another product already uses the web address “' + p.id + '”. Change the ID.');
    var skuClash = data.products.some(function (o, i) { return i !== editing.index && o.sku === p.sku; });
    if (skuClash) errors.push('Another product already uses the reference “' + p.sku + '”.');
    var ids = p.colours.map(function (c) { return c.name.en; });
    if (ids.some(function (id, i) { return ids.indexOf(id) !== i; })) errors.push('Two colours have the same English name.');
    if (errors.length) { alert(errors.join('\n')); return; }

    if (editing.index === -1) data.products.unshift(p);
    else data.products[editing.index] = p;
    editing = null;
    persist();
    render();
  }

  /* ---------- Settings ---------- */

  function renderSettings() {
    var s = data.settings;
    panel.innerHTML = '' +
      '<div class="admin-head"><div><h1>WhatsApp &amp; settings</h1><p>Where customer requests are sent and general shop information.</p></div></div>' +
      '<section class="panel"><h2>WhatsApp business number</h2>' +
        '<p class="small">All product requests, My Selection messages and the floating chat button open a conversation with this number.</p>' +
        '<div class="form-grid">' +
          field('WhatsApp number', '<input type="tel" data-s="whatsappNumber" value="' + esc(s.whatsappNumber) + '" placeholder="e.g. +212 6XX XX XX XX">',
            'Enter the number in international format. Spaces, “+” and dashes are removed automatically; a Moroccan 06/07 number is converted to 212.', true) +
          '<div class="full"><div class="field__msg" data-wa-msg></div><div class="wa-test" data-wa-test></div></div>' +
        '</div>' +
      '</section>' +
      '<section class="panel"><h2>Messages &amp; delivery</h2><p class="small">Text used across the site, in each language. Product request messages are written automatically in the visitor’s language.</p>' +
        '<div class="form-grid">' +
          locField('Default WhatsApp message (floating button)', 'data-sl="generalMessage"', s.generalMessage, { multiline: true, rows: 56 }) +
          locField('Delivery information (shown on every product page)', 'data-sl="deliveryInfo"', s.deliveryInfo, { multiline: true }) +
          field('Website address', '<input type="url" data-s="siteUrl" value="' + esc(s.siteUrl) + '" placeholder="https://www.bouchra.ma/">',
            'Optional. Used for the product links inside WhatsApp messages. Leave empty to use the address the customer is visiting.', true) +
          locField('Currency label', 'data-sl="currency"', s.currency) +
        '</div>' +
      '</section>';
    updateWaHint();
  }

  function updateWaHint() {
    var msg = panel.querySelector('[data-wa-msg]');
    var test = panel.querySelector('[data-wa-test]');
    if (!msg) return;
    var n = cleanNumber(data.settings.whatsappNumber);
    if (!data.settings.whatsappNumber) {
      msg.className = 'field__msg field__msg--err';
      msg.textContent = 'Not configured yet. Customers will be asked to choose a contact in WhatsApp.';
      test.innerHTML = '';
    } else if (n.length < 10 || n.length > 15) {
      msg.className = 'field__msg field__msg--err';
      msg.textContent = 'This does not look like a complete international number (' + n + ').';
      test.innerHTML = '';
    } else {
      msg.className = 'field__msg field__msg--ok';
      msg.textContent = 'Messages will be sent to +' + n + '.';
      var link = 'https://wa.me/' + n + '?text=' + encodeURIComponent(en(data.settings.generalMessage));
      test.innerHTML = 'Test link: <a target="_blank" rel="noopener" href="' + esc(link) + '">' + esc(link) + '</a>';
    }
  }

  /* ---------- Homepage ---------- */

  function renderHomepage() {
    var h = data.settings.homepage;
    panel.innerHTML = '' +
      '<div class="admin-head"><div><h1>Homepage content</h1><p>Promotional text on the homepage and the announcement bar on every page.</p></div>' +
        '<button type="button" class="abtn abtn--outline" data-action="preview">Preview homepage</button></div>' +
      '<section class="panel"><h2>Announcement bar</h2><p class="small">Thin bar at the very top of every page. Leave all languages empty to hide it.</p>' +
        '<div class="form-grid">' + locField('Announcement', 'data-hl="announcement"', h.announcement) + '</div>' +
      '</section>' +
      '<section class="panel"><h2>Hero</h2><p class="small">The first thing visitors see.</p>' +
        '<div class="form-grid">' +
          locField('Small heading', 'data-hl="heroEyebrow"', h.heroEyebrow) +
          locField('Main title', 'data-hl="heroTitle"', h.heroTitle) +
          locField('Introduction', 'data-hl="heroText"', h.heroText, { multiline: true }) +
        '</div>' +
      '</section>' +
      '<section class="panel"><h2>WhatsApp promotion</h2><p class="small">The dark section inviting visitors to order on WhatsApp.</p>' +
        '<div class="form-grid">' +
          locField('Title', 'data-hl="promoTitle"', h.promoTitle) +
          locField('Text', 'data-hl="promoText"', h.promoText, { multiline: true }) +
        '</div>' +
      '</section>';
  }

  /* ---------- Size guide ---------- */

  function renderSizeGuide() {
    var g = data.sizeGuide;
    var headRows = LANGS.map(function (l) {
      return '<tr><th class="sg-lang">' + l.label + '</th>' +
        g.columns.map(function (c, ci) {
          return '<th><input class="cell" data-sg-col="' + ci + '" data-lang="' + l.code + '" dir="' + l.dir + '" value="' + esc(loc(c)[l.code]) + '" aria-label="Column ' + (ci + 1) + ' title (' + l.label + ')"></th>';
        }).join('') + '<th></th></tr>';
    }).join('');
    panel.innerHTML = '' +
      '<div class="admin-head"><div><h1>Size guide</h1><p>Shown in the size guide window on every product page. Column titles are translated; measurements are shared.</p></div></div>' +
      '<section class="panel">' +
        '<div class="table-wrap"><table class="sg-table"><thead>' + headRows + '</thead><tbody>' +
          g.rows.map(function (r, ri) {
            return '<tr><td></td>' + r.map(function (cell, ci) {
              return '<td><input class="cell" data-sg-row="' + ri + '" data-sg-cell="' + ci + '" value="' + esc(cell) + '" aria-label="Row ' + (ri + 1) + ' ' + esc(en(g.columns[ci])) + '"></td>';
            }).join('') +
            '<td><button type="button" class="abtn abtn--sm abtn--danger" data-sg-remove="' + ri + '" aria-label="Remove row">✕</button></td></tr>';
          }).join('') +
        '</tbody></table></div>' +
        '<button type="button" class="abtn abtn--outline abtn--sm" data-sg-add>+ Add size</button>' +
        '<div class="form-grid" style="margin-top:20px">' +
          locField('Note under the table', 'data-sgn="note"', g.note) +
        '</div>' +
      '</section>';
  }

  /* ---------- Publish ---------- */

  function renderPublish() {
    panel.innerHTML = '' +
      '<div class="admin-head"><div><h1>Publish</h1><p>Make your draft live on the website.</p></div></div>' +
      '<section class="panel"><h2>How publishing works</h2>' +
        '<p class="small">Your website is a fast static site. Changes made here are saved as a draft in this browser only, until you publish them.</p>' +
        '<ol class="steps-list">' +
          '<li><strong>Preview</strong> your draft on the real site with “Preview site” (switch languages with the EN / FR / عربي buttons).</li>' +
          '<li><strong>Download catalog.js</strong> using the button below.</li>' +
          '<li><strong>Upload</strong> it to your hosting, replacing <code>data/catalog.js</code>. Upload any new photos added by path to <code>img/products/</code>.</li>' +
        '</ol>' +
      '</section>' +
      '<section class="panel"><h2>Actions</h2><p class="small">Back up or move your catalogue between computers.</p>' +
        '<div class="checks">' +
          '<button type="button" class="abtn" data-action="export">Download catalog.js</button>' +
          '<button type="button" class="abtn abtn--outline" data-action="preview">Preview site</button>' +
          '<button type="button" class="abtn abtn--outline" data-action="import">Import a catalogue file</button>' +
          '<button type="button" class="abtn abtn--danger" data-action="discard">Discard draft</button>' +
        '</div>' +
      '</section>';
  }

  function exportCatalog() {
    var header = '/*\n * BOUCHRA — central catalogue & site configuration.\n' +
      ' * Generated by admin.html on ' + new Date().toISOString().slice(0, 10) + '.\n' +
      ' * Replace data/catalog.js on the hosting with this file to publish.\n */\n';
    var blob = new Blob([header + 'window.BOUCHRA_CATALOG = ' + JSON.stringify(data, null, 2) + ';\n'], { type: 'text/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'catalog.js';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function importCatalog(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result);
      try {
        var start = text.indexOf('{');
        var end = text.lastIndexOf('}');
        var parsed = JSON.parse(text.slice(start, end + 1));
        if (!parsed.settings || !Array.isArray(parsed.products)) throw new Error('Missing settings or products');
        data = parsed;
        persist();
        editing = null;
        render();
        alert('Catalogue imported as a draft. Preview it, then download catalog.js to publish.');
      } catch (e) {
        alert('This file could not be read as a BOUCHRA catalogue.');
      }
    };
    reader.readAsText(file);
  }

  function preview() {
    try { localStorage.setItem(KEYS.preview, '1'); } catch (e) { /* ignore */ }
    window.open('index.html', '_blank');
  }

  /* ---------- Events ---------- */

  document.addEventListener('click', function (e) {
    var t = e.target;
    var action = t.closest('[data-action]');
    if (action) {
      var a = action.getAttribute('data-action');
      if (a === 'preview') {
        if (editing) { alert('Save the product first, then preview.'); return; }
        preview();
      }
      if (a === 'export') exportCatalog();
      if (a === 'import') importInput.click();
      if (a === 'new-product') openEditor(-1, blankProduct());
      if (a === 'save-product') saveProduct();
      if (a === 'cancel-edit') { editing = null; render(); }
      if (a === 'discard' && confirm('Discard all draft changes and return to the published catalogue?')) {
        data = clone(published);
        try { localStorage.removeItem(KEYS.draft); localStorage.removeItem(KEYS.preview); } catch (err) { /* ignore */ }
        updateStatus();
        render();
      }
      return;
    }

    var go = t.closest('[data-goto]');
    if (go) { document.querySelector('[data-tab="' + go.getAttribute('data-goto') + '"]').click(); return; }

    var edit = t.closest('[data-edit]');
    if (edit) { openEditor(Number(edit.getAttribute('data-edit')), clone(data.products[Number(edit.getAttribute('data-edit'))])); return; }

    var dup = t.closest('[data-duplicate]');
    if (dup) {
      var copy = clone(data.products[Number(dup.getAttribute('data-duplicate'))]);
      copy.name = loc(copy.name);
      copy.name.en += ' (copy)';
      copy.id = '';
      copy.sku += '-COPY';
      openEditor(-1, copy);
      return;
    }

    var del = t.closest('[data-delete]');
    if (del) {
      var idx = Number(del.getAttribute('data-delete'));
      if (confirm('Delete “' + en(data.products[idx].name) + '” from the catalogue?')) {
        data.products.splice(idx, 1);
        editing = null;
        persist();
        render();
      }
      return;
    }

    if (!editing) {
      if (t.closest('[data-sg-add]')) {
        data.sizeGuide.rows.push(data.sizeGuide.columns.map(function () { return ''; }));
        persist(); renderSizeGuide(); return;
      }
      var sgr = t.closest('[data-sg-remove]');
      if (sgr) { data.sizeGuide.rows.splice(Number(sgr.getAttribute('data-sg-remove')), 1); persist(); renderSizeGuide(); }
      return;
    }

    // Editor-only actions
    var p = editing.product;
    var move = t.closest('[data-img-move]');
    if (move) {
      var i = Number(move.getAttribute('data-img-move'));
      var j = i + Number(move.getAttribute('data-dir'));
      var tmp = p.images[i]; p.images[i] = p.images[j]; p.images[j] = tmp;
      renderImages(); return;
    }
    var rm = t.closest('[data-img-remove]');
    if (rm) { p.images.splice(Number(rm.getAttribute('data-img-remove')), 1); renderImages(); return; }
    if (t.closest('[data-add-path]')) {
      var input = panel.querySelector('[data-img-path]');
      var path = input.value.trim();
      if (path) { p.images.push(path); input.value = ''; renderImages(); }
      return;
    }
    if (t.closest('[data-add-colour]')) { p.colours.push({ name: loc(''), hex: '#D4B89C' }); renderColours(); return; }
    var cr = t.closest('[data-colour-remove]');
    if (cr) { p.colours.splice(Number(cr.closest('[data-colour-row]').getAttribute('data-colour-row')), 1); renderColours(); return; }

    var crow = t.closest('[data-colour-row]');
    if (!crow) return;
    var colour = p.colours[Number(crow.getAttribute('data-colour-row'))];
    var cimgRm = t.closest('[data-cimg-remove]');
    if (cimgRm) { colour.images.splice(Number(cimgRm.getAttribute('data-cimg-remove')), 1); renderColours(); return; }
    if (t.closest('[data-cimg-add]')) {
      var cpath = crow.querySelector('[data-cimg-path]').value.trim();
      if (cpath) { colour.images = (colour.images || []).concat(cpath); renderColours(); }
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    var lang = t.getAttribute('data-lang');

    if (t.matches('[data-search]')) { search = t.value; renderRows(); return; }

    if (t.hasAttribute('data-s')) {
      data.settings[t.getAttribute('data-s')] = t.value;
      persist(); updateWaHint(); return;
    }
    if (t.hasAttribute('data-sl')) {
      setLoc(data.settings, t.getAttribute('data-sl'), lang, t.value);
      persist(); updateWaHint(); return;
    }
    if (t.hasAttribute('data-hl')) {
      setLoc(data.settings.homepage, t.getAttribute('data-hl'), lang, t.value);
      persist(); return;
    }
    if (t.hasAttribute('data-sg-col')) {
      setLoc(data.sizeGuide.columns, Number(t.getAttribute('data-sg-col')), lang, t.value);
      persist(); return;
    }
    if (t.hasAttribute('data-sg-cell')) {
      data.sizeGuide.rows[Number(t.getAttribute('data-sg-row'))][Number(t.getAttribute('data-sg-cell'))] = t.value;
      persist(); return;
    }
    if (t.hasAttribute('data-sgn')) { setLoc(data.sizeGuide, 'note', lang, t.value); persist(); return; }

    if (!editing) return;
    var p = editing.product;

    var pf = t.getAttribute('data-pf');
    if (pf) {
      setLoc(p, pf, lang, t.value);
      if (pf === 'name' && lang === 'en' && !editing.idTouched) {
        p.id = slugify(t.value);
        panel.querySelector('[data-f="id"]').value = p.id;
      }
      if (pf === 'name') updateIdPreview();
      return;
    }

    var f = t.getAttribute('data-f');
    if (f) {
      if (t.type === 'checkbox') p[f] = t.checked;
      else if (f === 'price') p.price = t.value === '' ? null : Number(t.value);
      else p[f] = t.value;
      if (f === 'id') { editing.idTouched = true; updateIdPreview(); }
      return;
    }

    var row = t.closest('[data-colour-row]');
    if (row) {
      var c = p.colours[Number(row.getAttribute('data-colour-row'))];
      if (t.hasAttribute('data-colour-name')) setLoc(c, 'name', t.getAttribute('data-colour-name'), t.value);
      if (t.hasAttribute('data-colour-hex')) { c.hex = t.value; row.querySelector('[data-colour-hex-text]').value = t.value; }
      if (t.hasAttribute('data-colour-hex-text') && /^#[0-9a-f]{6}$/i.test(t.value)) { c.hex = t.value; row.querySelector('[data-colour-hex]').value = t.value; }
    }
  });

  function updateIdPreview() {
    var prev = panel.querySelector('[data-id-preview]');
    var p = editing.product;
    if (prev) prev.textContent = slugify(p.id || loc(p.name).en);
  }

  // Checkboxes and selects fire "change" reliably everywhere.
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (editing && t.getAttribute('data-f') && (t.type === 'checkbox' || t.tagName === 'SELECT')) {
      editing.product[t.getAttribute('data-f')] = t.type === 'checkbox' ? t.checked : t.value;
    }
    if (editing && t.matches('[data-upload]')) {
      var files = Array.prototype.slice.call(t.files);
      Promise.all(files.map(fileToDataUrl)).then(function (urls) {
        editing.product.images = editing.product.images.concat(urls);
        renderImages();
      }).catch(function (err) { alert(err.message); });
      t.value = '';
    }
    if (editing && t.matches('[data-cimg-upload]')) {
      var colour = editing.product.colours[Number(t.closest('[data-colour-row]').getAttribute('data-colour-row'))];
      Promise.all(Array.prototype.slice.call(t.files).map(fileToDataUrl)).then(function (urls) {
        colour.images = (colour.images || []).concat(urls);
        renderColours();
      }).catch(function (err) { alert(err.message); });
      t.value = '';
    }
    if (t === importInput && t.files[0]) {
      importCatalog(t.files[0]);
      t.value = '';
    }
  });

  window.addEventListener('beforeunload', function (e) {
    if (editing) { e.preventDefault(); e.returnValue = ''; }
  });

  updateStatus();
  render();
})();
