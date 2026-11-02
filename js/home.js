/* BOUCHRA — homepage */
(function () {
  'use strict';
  var B = window.Bouchra;
  var home = B.settings.homepage || {};

  document.querySelectorAll('[data-home]').forEach(function (el) {
    var value = B.tr(home[el.getAttribute('data-home')]);
    if (value) el.textContent = value;
  });

  var cats = document.querySelector('[data-categories]');
  cats.innerHTML = B.catalog.categories.map(function (c) {
    return '' +
      '<a class="cat-tile" href="collection.html?category=' + encodeURIComponent(c.id) + '">' +
        '<img src="' + B.esc(c.image) + '" alt="" loading="lazy">' +
        '<span class="cat-tile__label"><h3>' + B.esc(B.tr(c.name)) + '</h3><span>' + B.esc(B.t('home.discover')) + '</span></span>' +
      '</a>';
  }).join('');

  var visible = B.catalog.products.filter(function (p) { return p.availability !== 'out-of-stock'; });
  var groups = {
    'new': visible.filter(function (p) { return p.newArrival; }),
    'best': visible.filter(function (p) { return p.bestSeller; })
  };

  document.querySelectorAll('[data-products]').forEach(function (grid) {
    var list = groups[grid.getAttribute('data-products')].slice(0, 4);
    if (!list.length) {
      grid.closest('.section').hidden = true;
      return;
    }
    grid.innerHTML = list.map(B.productCard).join('');
  });
})();
