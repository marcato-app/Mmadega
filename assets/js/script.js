(function () {
  var WHATSAPP_NUMBER = '5511983463846';
  var CART_KEY = 'mmCarrinho';

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function parsePrice(str) {
    var digits = String(str).replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(digits) || 0;
  }

  function formatPrice(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ---------------------------------------------------------------------
  // Carrinho: guardado no localStorage do navegador (sem backend). Cada
  // item carrega o que precisa pra montar a lista e a mensagem do WhatsApp.
  // ---------------------------------------------------------------------
  var cart = {};

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      cart = raw ? JSON.parse(raw) : {};
    } catch (e) {
      cart = {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function cartEntries() {
    return Object.keys(cart).map(function (id) { return cart[id]; })
      .filter(function (entry) { return entry.qty > 0; });
  }

  function cartCount() {
    return cartEntries().reduce(function (sum, entry) { return sum + entry.qty; }, 0);
  }

  function cartTotal() {
    return cartEntries().reduce(function (sum, entry) { return sum + entry.qty * entry.price; }, 0);
  }

  function setQty(id, qty, meta) {
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = {
        name: meta.name,
        unit: meta.unit || '',
        price: meta.price,
        qty: qty
      };
    }
    saveCart();
    syncCartUI();
  }

  function getQty(id) {
    return cart[id] ? cart[id].qty : 0;
  }

  function buildWhatsAppMessage() {
    var entries = cartEntries();
    var lines = entries.map(function (entry) {
      var label = entry.name + (entry.unit ? ' ' + entry.unit : '');
      return entry.qty + 'x ' + label + ' — ' + formatPrice(entry.qty * entry.price);
    });
    var msg = 'Olá! Quero fazer um pedido na Adega MM:\n\n' +
      lines.join('\n') +
      '\n\nTotal: ' + formatPrice(cartTotal());
    return msg;
  }

  // ---------------------------------------------------------------------
  // Renderização do cardápio
  // ---------------------------------------------------------------------

  function renderQtyControl(id, meta) {
    var qty = getQty(id);
    var wrap = el('span', 'qty-control');
    wrap.dataset.qty = String(qty);

    var addBtn = el('button', 'qty-add', '+');
    addBtn.type = 'button';
    addBtn.setAttribute('aria-label', 'Adicionar ao pedido');
    addBtn.addEventListener('click', function () {
      setQty(id, getQty(id) + 1, meta);
    });

    var stepper = el('span', 'qty-stepper');
    var minusBtn = el('button', 'qty-minus', '−');
    minusBtn.type = 'button';
    minusBtn.setAttribute('aria-label', 'Diminuir quantidade');
    minusBtn.addEventListener('click', function () {
      setQty(id, getQty(id) - 1, meta);
    });
    var valueEl = el('span', 'qty-value', String(qty || 1));
    var plusBtn = el('button', 'qty-plus', '+');
    plusBtn.type = 'button';
    plusBtn.setAttribute('aria-label', 'Aumentar quantidade');
    plusBtn.addEventListener('click', function () {
      setQty(id, getQty(id) + 1, meta);
    });
    stepper.appendChild(minusBtn);
    stepper.appendChild(valueEl);
    stepper.appendChild(plusBtn);

    wrap.appendChild(addBtn);
    wrap.appendChild(stepper);
    return wrap;
  }

  function renderItem(item, group, section, itemId) {
    var li = el('li', 'item');
    li.dataset.itemId = itemId;
    var row = el('div', 'item-row');
    var nameHtml = item.name + (item.unit ? ' <span class="unit">' + item.unit + '</span>' : '');
    row.appendChild(el('span', 'item-name', nameHtml));

    var right = el('span', 'item-right');
    right.appendChild(el('span', 'item-price', item.price));
    right.appendChild(renderQtyControl(itemId, {
      name: item.name,
      unit: item.unit,
      price: parsePrice(item.price)
    }));
    row.appendChild(right);

    li.appendChild(row);
    if (item.note) li.appendChild(el('p', 'item-note', item.note));

    var searchParts = [
      item.name, item.unit, item.note,
      group.title, group.keywords,
      section.title
    ].filter(Boolean);
    li.dataset.search = searchParts.join(' ').toLowerCase();

    return li;
  }

  function renderGroup(group, section, sectionIdx, groupIdx) {
    var frag = document.createDocumentFragment();
    var titleEl = el('h3', 'group-title', group.title);
    if (group.anchorId) titleEl.id = group.anchorId;
    frag.appendChild(titleEl);
    if (group.note) frag.appendChild(el('p', 'group-note', group.note));
    var list = el('ul', 'menu-list');
    (group.items || []).forEach(function (item, itemIdx) {
      var itemId = sectionIdx + '-' + groupIdx + '-' + itemIdx;
      list.appendChild(renderItem(item, group, section, itemId));
    });
    frag.appendChild(list);
    return frag;
  }

  var SECTION_PHOTO = {
    cervejas: { src: 'assets/img/beer-lineup.jpg', alt: 'Cervejas geladas Adega MM' },
    garrafas: { src: 'assets/img/whisky-lineup.jpg', alt: 'Garrafas de whisky Adega MM' },
    bebidas: { src: 'assets/img/wine-lineup.jpg', alt: 'Vinhos Adega MM' }
  };

  function renderPhoto(id) {
    var photo = SECTION_PHOTO[id];
    if (!photo) return null;
    var wrap = el('div', 'section-photo');
    var img = el('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    wrap.appendChild(img);
    return wrap;
  }

  function renderSection(section, sectionIdx) {
    var sec = el('section', 'menu-section');
    sec.id = section.id;
    sec.appendChild(el('h2', 'section-title', section.title));
    (section.groups || []).forEach(function (group, groupIdx) {
      sec.appendChild(renderGroup(group, section, sectionIdx, groupIdx));
    });
    return sec;
  }

  function renderMenu(data) {
    var root = document.getElementById('menuRoot');
    root.classList.remove('loading');
    root.innerHTML = '';
    (data.sections || []).forEach(function (section, sectionIdx) {
      root.appendChild(renderSection(section, sectionIdx));
      var photo = renderPhoto(section.id);
      if (photo) root.appendChild(photo);
    });
  }

  function renderError() {
    var root = document.getElementById('menuRoot');
    root.classList.remove('loading');
    root.innerHTML = '<p class="loading-msg">Não foi possível carregar o cardápio agora. Recarregue a página.</p>';
  }

  // ---------------------------------------------------------------------
  // Sincroniza a barra do carrinho, a gaveta de pedido e cada controle de
  // quantidade visível no cardápio sempre que o carrinho muda.
  // ---------------------------------------------------------------------
  function syncCartUI() {
    var count = cartCount();
    var total = cartTotal();

    document.querySelectorAll('.qty-control').forEach(function (control) {
      var li = control.closest('.item');
      var qty = li ? getQty(li.dataset.itemId) : 0;
      control.dataset.qty = String(qty);
      var valueEl = control.querySelector('.qty-value');
      if (valueEl) valueEl.textContent = String(qty || 1);
    });

    var cartBar = document.getElementById('cartBar');
    var cartCountEl = document.getElementById('cartCount');
    var cartTotalEl = document.getElementById('cartTotal');
    if (cartBar) cartBar.classList.toggle('hidden', count === 0);
    if (cartCountEl) cartCountEl.textContent = String(count);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);

    var cartList = document.getElementById('cartList');
    var cartEmpty = document.getElementById('cartEmpty');
    var cartDrawerTotal = document.getElementById('cartDrawerTotal');
    var cartSendBtn = document.getElementById('cartSendBtn');
    var cartClearBtn = document.getElementById('cartClearBtn');

    if (cartList) {
      var entries = Object.keys(cart).map(function (id) {
        var e = cart[id]; return { id: id, entry: e };
      }).filter(function (x) { return x.entry.qty > 0; });

      cartList.innerHTML = '';
      entries.forEach(function (x) {
        var li = el('li', 'cart-item');
        li.dataset.itemId = x.id;
        var info = el('div', 'cart-item-info');
        var label = x.entry.name + (x.entry.unit ? ' <span class="unit">' + x.entry.unit + '</span>' : '');
        info.appendChild(el('span', 'cart-item-name', label));
        info.appendChild(el('span', 'cart-item-price', formatPrice(x.entry.qty * x.entry.price)));
        li.appendChild(info);

        var stepper = el('span', 'qty-stepper');
        var minusBtn = el('button', 'qty-minus', '−');
        minusBtn.type = 'button';
        minusBtn.setAttribute('aria-label', 'Diminuir quantidade');
        minusBtn.addEventListener('click', function () {
          setQty(x.id, getQty(x.id) - 1, x.entry);
        });
        var valueEl = el('span', 'qty-value', String(x.entry.qty));
        var plusBtn = el('button', 'qty-plus', '+');
        plusBtn.type = 'button';
        plusBtn.setAttribute('aria-label', 'Aumentar quantidade');
        plusBtn.addEventListener('click', function () {
          setQty(x.id, getQty(x.id) + 1, x.entry);
        });
        stepper.appendChild(minusBtn);
        stepper.appendChild(valueEl);
        stepper.appendChild(plusBtn);
        li.appendChild(stepper);

        cartList.appendChild(li);
      });

      if (cartEmpty) cartEmpty.classList.toggle('hidden', entries.length > 0);
      cartList.classList.toggle('hidden', entries.length === 0);
    }

    if (cartDrawerTotal) cartDrawerTotal.textContent = formatPrice(total);
    if (cartClearBtn) cartClearBtn.classList.toggle('hidden', count === 0);

    if (cartSendBtn) {
      if (count === 0) {
        cartSendBtn.classList.add('is-disabled');
        cartSendBtn.removeAttribute('href');
      } else {
        cartSendBtn.classList.remove('is-disabled');
        cartSendBtn.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildWhatsAppMessage());
      }
    }
  }

  function initCart() {
    loadCart();

    var cartBarBtn = document.getElementById('cartBarBtn');
    var cartOverlay = document.getElementById('cartOverlay');
    var cartDrawer = document.getElementById('cartDrawer');
    var cartClose = document.getElementById('cartClose');
    var cartClearBtn = document.getElementById('cartClearBtn');

    function openDrawer() {
      if (cartOverlay) cartOverlay.classList.remove('hidden');
      if (cartDrawer) cartDrawer.classList.remove('hidden');
      document.body.classList.add('cart-open');
    }
    function closeDrawer() {
      if (cartOverlay) cartOverlay.classList.add('hidden');
      if (cartDrawer) cartDrawer.classList.add('hidden');
      document.body.classList.remove('cart-open');
    }

    if (cartBarBtn) cartBarBtn.addEventListener('click', openDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);
    if (cartClose) cartClose.addEventListener('click', closeDrawer);
    if (cartClearBtn) {
      cartClearBtn.addEventListener('click', function () {
        cart = {};
        saveCart();
        syncCartUI();
      });
    }

    syncCartUI();
  }

  // A capa se apaga sozinha pelo CSS. Aqui só tratamos o toque para pular e
  // a regra de mostrar uma vez por visita.
  function welcome() {
    var cover = document.getElementById('welcome');
    if (!cover) return;

    var quieter = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = false;
    try { seen = sessionStorage.getItem('mmBoasVindas') === '1'; } catch (e) {}

    if (quieter || seen) {
      cover.parentNode.removeChild(cover);
      return;
    }

    try { sessionStorage.setItem('mmBoasVindas', '1'); } catch (e) {}
    document.body.classList.add('welcoming');

    var close = function () {
      document.body.classList.remove('welcoming');
      cover.classList.add('gone');
      setTimeout(function () {
        if (cover.parentNode) cover.parentNode.removeChild(cover);
      }, 600);
    };

    cover.addEventListener('click', close);
    setTimeout(close, 2150);
  }

  welcome();

  function init() {
    var siteNav = document.getElementById('siteNav');
    var navLinks = siteNav ? Array.prototype.slice.call(siteNav.querySelectorAll('a')) : [];
    var backToTop = document.getElementById('backToTop');

    function onScroll() {
      var scrollPos = window.scrollY + 110;
      var current = null;
      navLinks.forEach(function (link) {
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (target && target.offsetTop <= scrollPos) current = link;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link === current);
      });
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    var searchInput = document.getElementById('menuSearch');
    var noResults = document.getElementById('noResults');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var query = searchInput.value.trim().toLowerCase();
        var items = Array.prototype.slice.call(document.querySelectorAll('.item'));
        var groups = Array.prototype.slice.call(document.querySelectorAll('.group-title'));
        var sections = Array.prototype.slice.call(document.querySelectorAll('.menu-section'));
        var anyVisible = false;

        items.forEach(function (item) {
          var text = item.dataset.search || item.textContent.toLowerCase();
          var match = query === '' || text.indexOf(query) !== -1;
          item.classList.toggle('hidden', !match);
          if (match) anyVisible = true;
        });

        groups.forEach(function (group) {
          var e = group.nextElementSibling;
          var hasVisible = false;
          while (e && !e.classList.contains('group-title')) {
            if (e.classList.contains('group-note')) {
              e.classList.toggle('hidden', query !== '');
            }
            if (e.classList.contains('menu-list')) {
              hasVisible = e.querySelectorAll('.item:not(.hidden)').length > 0;
            }
            e = e.nextElementSibling;
          }
          group.classList.toggle('hidden', query !== '' && !hasVisible);
        });

        sections.forEach(function (section) {
          var hasVisible = section.querySelectorAll('.item:not(.hidden)').length > 0;
          var hide = query !== '' && !hasVisible;
          section.classList.toggle('hidden', hide);
          var photo = section.nextElementSibling;
          if (photo && photo.classList.contains('section-photo')) {
            photo.classList.toggle('hidden', query !== '');
          }
        });

        if (noResults) noResults.classList.toggle('hidden', anyVisible);
      });
    }

    if (window.MENU_DATA) {
      renderMenu(window.MENU_DATA);
      onScroll();
      initCart();
    } else {
      renderError();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
