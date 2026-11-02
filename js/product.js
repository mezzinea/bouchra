/* BOUCHRA — product page */
(function () {
  'use strict';
  var B = window.Bouchra;
  var esc = B.esc;
  var t = B.t;
  var tr = B.tr;
  var root = document.querySelector('[data-product-root]');
  var id = new URLSearchParams(window.location.search).get('id');
  var p = id ? B.getProduct(id) : null;

  if (!p) {
    document.title = t('pdp.notFound') + ' — BOUCHRA';
    root.innerHTML = '' +
      '<div class="empty" style="padding:120px 0">' +
        '<h1 style="font-size:36px">' + esc(t('pdp.notFound')) + '</h1>' +
        '<p>' + esc(t('pdp.notFoundText')) + '</p>' +
        '<a class="btn" href="collection.html">' + esc(t('home.explore')) + '</a>' +
      '</div>';
    return;
  }

  var name = tr(p.name);
  var cat = B.getCategory(p.category);
  var avail = B.availability(p.availability);
  var colours = p.colours || [];
  var sizes = p.sizes || [];
  var requested = new URLSearchParams(window.location.search).get('colour');
  var sep = '<span aria-hidden="true">◆</span>';
  // Gallery arrows point the way the page reads.
  var arrows = B.isRtl ? { prev: '›', next: '‹' } : { prev: '‹', next: '›' };

  var state = {
    image: 0,
    colour: colours.some(function (c) { return B.colourId(c) === requested; })
      ? requested : colours.length ? B.colourId(colours[0]) : '',
    size: sizes.length === 1 ? sizes[0] : '',
    qty: 1
  };

  document.title = name + ' — ' + t('meta.suffix');
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', tr(p.description).slice(0, 155));

  var images = B.imagesFor(p, state.colour);

  var wa = B.icons.whatsapp;

  var notice = '';
  if (p.availability === 'out-of-stock') notice = '<p class="notice">' + esc(t('pdp.soldOutNote')) + '</p>';
  else if (p.availability === 'made-to-order') notice = '<p class="notice">' + esc(t('pdp.madeNote')) + '</p>';

  var care = tr(p.care);

  root.innerHTML = '' +
    '<nav class="breadcrumb" aria-label="' + esc(t('pdp.breadcrumb')) + '">' +
      '<a href="index.html">' + esc(t('pdp.home')) + '</a>' + sep +
      (cat ? '<a href="collection.html?category=' + encodeURIComponent(cat.id) + '">' + esc(tr(cat.name)) + '</a>' + sep : '') +
      '<span aria-current="page">' + esc(name) + '</span>' +
    '</nav>' +
    '<div class="pdp">' +
      '<div class="gallery" data-gallery>' + galleryHtml() + '</div>' +

      '<div class="pdp__info">' +
        '<p class="pdp__cat">' + esc(cat ? tr(cat.name) : '') + '</p>' +
        '<h1>' + esc(name) + '</h1>' +
        '<p class="pdp__ref">' + esc(t('pdp.ref')) + ' <bdi>' + esc(p.sku) + '</bdi></p>' +
        '<div class="pdp__price-row">' +
          '<p class="pdp__price">' + esc(B.formatPrice(p.price)) + '</p>' +
          '<span class="status status--' + avail.tone + '">' + esc(avail.label) + '</span>' +
        '</div>' +
        '<p class="pdp__desc">' + esc(tr(p.description)) + '</p>' +

        (colours.length ?
          '<div class="option">' +
            '<p class="option__label" id="colour-label">' + esc(t('pdp.colour')) + ' <em data-colour-name>' + esc(B.colourName(p, state.colour)) + '</em></p>' +
            '<div class="option__row" role="radiogroup" aria-labelledby="colour-label">' +
              colours.map(function (c) {
                var cid = B.colourId(c);
                var label = tr(c.name);
                return '<button type="button" role="radio" class="swatch" data-colour="' + esc(cid) + '" aria-label="' + esc(label) + '" title="' + esc(label) + '" aria-checked="' + (cid === state.colour) + '">' +
                  '<span style="background:' + esc(c.hex) + '"></span></button>';
              }).join('') +
            '</div>' +
          '</div>' : '') +

        (sizes.length ?
          '<div class="option" data-size-option>' +
            '<p class="option__label"><span id="size-label">' + esc(t('pdp.size')) + '</span><button type="button" class="link-btn" data-open-size-guide>' + esc(t('pdp.sizeGuide')) + '</button></p>' +
            '<div class="option__row" role="radiogroup" aria-labelledby="size-label">' +
              sizes.map(function (s) {
                return '<button type="button" role="radio" class="size-btn" data-size="' + esc(s) + '" aria-checked="' + (s === state.size) + '">' + esc(s) + '</button>';
              }).join('') +
            '</div>' +
            '<p class="option__error" data-size-error hidden role="alert">' + esc(t('pdp.sizeError')) + '</p>' +
          '</div>' : '') +

        '<div class="option">' +
          '<p class="option__label" id="qty-label">' + esc(t('pdp.qty')) + '</p>' +
          '<div class="qty" role="group" aria-labelledby="qty-label">' +
            '<button type="button" data-qty="-1" aria-label="' + esc(t('sel.dec')) + '">' + B.icons.minus + '</button>' +
            '<output data-qty-value aria-live="polite">1</output>' +
            '<button type="button" data-qty="1" aria-label="' + esc(t('sel.inc')) + '">' + B.icons.plus + '</button>' +
          '</div>' +
        '</div>' +

        notice +

        '<div class="pdp__actions">' +
          '<a class="btn btn--wa btn--lg btn--block pdp__order" data-order target="_blank" rel="noopener" href="#">' + wa + esc(t('pdp.order')) + '</a>' +
          '<button type="button" class="btn btn--outline btn--block" data-add>' + B.icons.bag + esc(t('pdp.add')) + '</button>' +
        '</div>' +
        '<p class="pdp__ask"><a target="_blank" rel="noopener" href="' + esc(B.whatsapp.link(B.whatsapp.productQuestionMessage(p))) + '">' + wa + esc(t('pdp.ask')) + '</a></p>' +
        '<p class="pdp__how">' + esc(t('pdp.how')) + '</p>' +

        '<div class="accordion">' +
          '<details open><summary>' + esc(t('pdp.fabric')) + '</summary><div><p>' + esc(tr(p.fabric) || t('pdp.fabricFallback')) + '</p></div></details>' +
          '<details><summary>' + esc(t('pdp.fit')) + '</summary><div><p>' + esc(t('pdp.sizes', { list: sizes.join(', ') || t('pdp.oneSize') })) + '</p>' +
            '<p><button type="button" class="link-btn" data-open-size-guide>' + esc(t('pdp.openGuide')) + '</button></p></div></details>' +
          '<details><summary>' + esc(t('pdp.delivery')) + '</summary><div><p>' + esc(tr(B.settings.deliveryInfo)) + '</p></div></details>' +
          (care ? '<details><summary>' + esc(t('pdp.care')) + '</summary><div><p>' + esc(care) + '</p></div></details>' : '') +
        '</div>' +
      '</div>' +
    '</div>';

  function galleryHtml() {
    return '' +
      '<div class="gallery__thumbs" role="group" aria-label="' + esc(t('pdp.images')) + '"' + (images.length > 1 ? '' : ' hidden') + '>' +
        images.map(function (src, i) {
          return '<button type="button" class="gallery__thumb" data-thumb="' + i + '" aria-label="' + esc(t('pdp.viewImage', { n: i + 1 })) + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
            '<img src="' + esc(src) + '" alt=""></button>';
        }).join('') +
      '</div>' +
      '<div class="gallery__main">' +
        '<img src="' + esc(images[0]) + '" alt="' + esc(name) + '" data-main-img>' +
        (images.length > 1
          ? '<button type="button" class="gallery__nav gallery__nav--prev" data-step="-1" aria-label="' + esc(t('pdp.prev')) + '">' + arrows.prev + '</button>' +
            '<button type="button" class="gallery__nav gallery__nav--next" data-step="1" aria-label="' + esc(t('pdp.next')) + '">' + arrows.next + '</button>'
          : '') +
      '</div>';
  }

  // Swap the gallery when the chosen colour has its own photos.
  function updateGallery() {
    var next = B.imagesFor(p, state.colour);
    if (next.join('|') === images.join('|')) return;
    images = next;
    state.image = 0;
    root.querySelector('[data-gallery]').innerHTML = galleryHtml();
    mainImg = root.querySelector('[data-main-img]');
  }

  // Mobile sticky order bar
  var sticky = document.createElement('div');
  sticky.className = 'sticky-order';
  sticky.innerHTML = '' +
    '<div class="sticky-order__info"><p>' + esc(name) + '</p><strong>' + esc(B.formatPrice(p.price)) + '</strong></div>' +
    '<a class="btn btn--wa" data-order target="_blank" rel="noopener" href="#">' + wa + esc(t('pdp.orderShort')) + '</a>';
  document.body.appendChild(sticky);

  var mainImg = root.querySelector('[data-main-img]');
  var orderLinks = document.querySelectorAll('[data-order]');
  var sizeOption = root.querySelector('[data-size-option]');
  var sizeError = root.querySelector('[data-size-error]');

  function needsSize() {
    return sizes.length > 0 && !state.size;
  }

  function updateOrderLinks() {
    var href = B.whatsapp.link(B.whatsapp.productMessage(p, state));
    orderLinks.forEach(function (a) { a.href = href; });
  }

  function showSizeError() {
    sizeOption.classList.remove('has-error');
    void sizeOption.offsetWidth; // restart the shake animation
    sizeOption.classList.add('has-error');
    sizeError.hidden = false;
    B.toast(esc(t('pdp.sizeError')));
    sizeOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var first = sizeOption.querySelector('[data-size]');
    if (first) first.focus({ preventScroll: true });
  }

  function setImage(i) {
    state.image = (i + images.length) % images.length;
    mainImg.src = images[state.image];
    root.querySelectorAll('[data-thumb]').forEach(function (th, idx) {
      if (idx === state.image) th.setAttribute('aria-current', 'true');
      else th.removeAttribute('aria-current');
    });
  }

  root.addEventListener('click', function (e) {
    var el = e.target;
    var thumb = el.closest('[data-thumb]');
    if (thumb) { setImage(Number(thumb.getAttribute('data-thumb'))); return; }
    var step = el.closest('[data-step]');
    if (step) { setImage(state.image + Number(step.getAttribute('data-step'))); return; }

    var colour = el.closest('[data-colour]');
    if (colour) {
      state.colour = colour.getAttribute('data-colour');
      root.querySelectorAll('[data-colour]').forEach(function (b) { b.setAttribute('aria-checked', String(b === colour)); });
      root.querySelector('[data-colour-name]').textContent = B.colourName(p, state.colour);
      updateGallery();
      updateOrderLinks();
      return;
    }

    var size = el.closest('[data-size]');
    if (size) {
      state.size = size.getAttribute('data-size');
      root.querySelectorAll('[data-size]').forEach(function (b) { b.setAttribute('aria-checked', String(b === size)); });
      sizeOption.classList.remove('has-error');
      sizeError.hidden = true;
      updateOrderLinks();
      return;
    }

    var qty = el.closest('[data-qty]');
    if (qty) {
      state.qty = Math.max(1, Math.min(20, state.qty + Number(qty.getAttribute('data-qty'))));
      root.querySelector('[data-qty-value]').textContent = state.qty;
      updateOrderLinks();
      return;
    }

    if (el.closest('[data-add]')) {
      if (needsSize()) { showSizeError(); return; }
      B.selection.add({ id: p.id, size: state.size, colour: state.colour, qty: state.qty });
      // Open the drawer so the customer sees the piece was added.
      B.openSelection();
    }
  });

  // Order buttons (main + sticky bar) require a size first.
  orderLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (needsSize()) { e.preventDefault(); showSizeError(); }
    });
  });

  // Arrow keys move through radio groups, following the reading direction.
  root.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var current = e.target.closest('[role="radio"]');
    if (!current) return;
    var forward = (e.key === 'ArrowRight') !== B.isRtl;
    var group = Array.prototype.slice.call(current.parentNode.querySelectorAll('[role="radio"]'));
    var next = group[(group.indexOf(current) + (forward ? 1 : -1) + group.length) % group.length];
    next.focus();
    next.click();
    e.preventDefault();
  });

  // Swipe through gallery on touch screens (mirrored in Arabic).
  var touchX = null;
  var gallery = root.querySelector('[data-gallery]');
  gallery.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  gallery.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) setImage(state.image + ((dx < 0) !== B.isRtl ? 1 : -1));
    touchX = null;
  });

  // Show the sticky bar once the main order button scrolls out of view.
  var mainOrder = root.querySelector('.pdp__order');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var entry = entries[0];
      sticky.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 100);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(mainOrder); // offset for the sticky header
  }

  updateOrderLinks();

  // Related pieces: same category first, then the rest.
  var others = B.catalog.products.filter(function (o) { return o.id !== p.id && o.availability !== 'out-of-stock'; });
  var related = others.filter(function (o) { return o.category === p.category; })
    .concat(others.filter(function (o) { return o.category !== p.category; }))
    .slice(0, 4);
  if (related.length) {
    document.querySelector('[data-related]').innerHTML = related.map(B.productCard).join('');
    document.querySelector('[data-related-section]').hidden = false;
  }
})();
