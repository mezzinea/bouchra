/* BOUCHRA — collection page */
(function () {
  'use strict';
  var B = window.Bouchra;
  var params = new URLSearchParams(window.location.search);

  // Single active filter: "all", a category id, "new" or "best".
  var state = {
    filter: params.get('category') || params.get('filter') || 'all',
    sort: params.get('sort') || 'featured'
  };

  if (state.filter === 'new') document.body.setAttribute('data-page', 'new');
  if (state.filter === 'best') document.body.setAttribute('data-page', 'best');

  var chips = [{ id: 'all', name: B.t('col.all') }]
    .concat(B.catalog.categories.map(function (c) { return { id: c.id, name: B.tr(c.name) }; }))
    .concat([{ id: 'new', name: B.t('nav.new') }, { id: 'best', name: B.t('nav.best') }]);

  var chipsEl = document.querySelector('[data-chips]');
  var grid = document.querySelector('[data-grid]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');
  var sortEl = document.querySelector('[data-sort]');
  var titleEl = document.querySelector('[data-collection-title]');

  sortEl.value = state.sort;

  function matches(p) {
    if (state.filter === 'all') return true;
    if (state.filter === 'new') return p.newArrival;
    if (state.filter === 'best') return p.bestSeller;
    return p.category === state.filter;
  }

  function price(p) {
    return p.price === null || p.price === '' || p.price === undefined ? null : Number(p.price);
  }

  function sorted(list) {
    var out = list.slice();
    // Sold-out pieces always go last.
    var soldOut = function (p) { return p.availability === 'out-of-stock' ? 1 : 0; };
    out.sort(function (a, b) {
      var s = soldOut(a) - soldOut(b);
      if (s) return s;
      if (state.sort === 'new') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      if (state.sort === 'price-asc' || state.sort === 'price-desc') {
        var pa = price(a), pb = price(b);
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1; // "price on request" last
        if (pb === null) return -1;
        return state.sort === 'price-asc' ? pa - pb : pb - pa;
      }
      return 0;
    });
    return out;
  }

  function render() {
    var active = chips.filter(function (c) { return c.id === state.filter; })[0] || chips[0];
    titleEl.textContent = active.id === 'all' ? B.t('col.title') : active.name;
    document.title = (active.id === 'all' ? B.t('col.docTitle') : active.name) + ' — ' + B.t('meta.suffix');

    chipsEl.innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-chip="' + B.esc(c.id) + '" aria-pressed="' + (c.id === active.id) + '">' + B.esc(c.name) + '</button>';
    }).join('');

    var list = sorted(B.catalog.products.filter(matches));
    grid.innerHTML = list.map(B.productCard).join('');
    emptyEl.hidden = list.length > 0;
    countEl.textContent = B.t(list.length === 1 ? 'col.piece' : 'col.pieces', { n: list.length });
  }

  function syncUrl() {
    var q = new URLSearchParams();
    if (state.filter === 'new' || state.filter === 'best') q.set('filter', state.filter);
    else if (state.filter !== 'all') q.set('category', state.filter);
    if (state.sort !== 'featured') q.set('sort', state.sort);
    var qs = q.toString();
    history.replaceState(null, '', 'collection.html' + (qs ? '?' + qs : ''));
  }

  chipsEl.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-chip]');
    if (!chip) return;
    state.filter = chip.getAttribute('data-chip');
    syncUrl();
    render();
  });

  sortEl.addEventListener('change', function () {
    state.sort = sortEl.value;
    syncUrl();
    render();
  });

  render();
})();
