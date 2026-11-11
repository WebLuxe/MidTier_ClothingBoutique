/* =============================================================================
   WebLuxe High Fashion Boutique: Business demo (Mid tier)
   Builds the header, menus, footer, bag and wishlist on every page, then the
   page itself (data-page on <body>: home, shop, product, contact, lost).
   Pieces come from data.js (window.SITE_DATA), which the owner panel edits.
   ============================================================================= */
(() => {
    'use strict';

    /* ------------------------------------------------------------------ shop details */
    const SHOP = {
        name: 'WebLuxe High Fashion Boutique',
        short: 'WebLuxe',
        whatsapp: '',              // the shop's WhatsApp number, international format, no + or spaces
        freeDelivery: 5000,
        boutiques: [
            { town: 'Rose Hill', street: 'Royal Road, Rose Hill', note: 'Opposite the bus station', map: 'Rose+Hill+Mauritius' },
            { town: 'Grand Baie', street: 'Coastal Road, Grand Baie', note: 'A short walk from the beach', map: 'Grand+Baie+Mauritius' }
        ],
        hours: [['Monday to Friday', '9:00 to 18:00'], ['Saturday', '9:00 to 17:00'], ['Sunday', '9:00 to 12:30']]
    };
    const CATS = [
        { key: 'saree', label: 'Sarees', one: 'Saree', group: 'women' },
        { key: 'bridal', label: 'Bridal Lehengas', one: 'Bridal lehenga', group: 'lehenga' },
        { key: 'lehenga', label: 'Party Lehengas', one: 'Party lehenga', group: 'lehenga' },
        { key: 'gown', label: 'Suits & Anarkalis', one: 'Suit', group: 'women' },
        { key: 'groom', label: 'Groom Sherwanis', one: 'Sherwani', group: 'men' },
        { key: 'men', label: "Men's Kurtas", one: 'Kurta', group: 'men' }
    ];
    const CAT = Object.fromEntries(CATS.map(c => [c.key, c]));
    const SWATCH = { red: '#c0262d', maroon: '#6b1424', wine: '#5a1430', pink: '#e27396', rose: '#d8798c', magenta: '#b0236e', peach: '#f2b38f', orange: '#e0782b', mustard: '#d4a02a', yellow: '#efc94c', gold: '#c9a043', beige: '#d9c3a0', cream: '#efe4cc', ivory: '#f4ecd8', white: '#fafafa', silver: '#c4c4c4', grey: '#8a8a8a', black: '#222', navy: '#1f2f5c', blue: '#2f5fa8', teal: '#167070', green: '#2f7d3f', emerald: '#0f6b4a', olive: '#6b6b2a', purple: '#6a3a8a', lilac: '#b49ad1', lavender: '#b9a7d9', brown: '#7a4d2b', mint: '#a8d5c2', rust: '#b5532a', coral: '#ee8a72', saffron: '#f08a24', ruby: '#9b1b30', bronze: '#a0703a', plum: '#6b2d5c' };

    /* ------------------------------------------------------------------ helpers */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const rs = n => 'Rs ' + Math.round(n).toLocaleString('en-US');
    const isId = v => /^\d{10,}-[0-9a-f]{6,}$/.test(v || '');
    const IMG = (v, w = 600) => !v ? '' : isId(v) ? `https://images.unsplash.com/photo-${v}?auto=format&fit=crop&w=${w}&q=72` : v;
    const SRCSET = (v, sizes) => !isId(v) ? '' : ` srcset="${[300, 450, 650, 900].map(w => `${IMG(v, w)} ${w}w`).join(', ')}" sizes="${sizes}"`;
    const store = {
        get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
    };
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HOVER = matchMedia('(hover: hover)').matches;
    const wa = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
    const ICON = {
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
        bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
        pin: '<path d="M12 21s-6-5.4-6-11a6 6 0 0 1 12 0c0 5.6-6 11-6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
        menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
        x: '<path d="M6 6l12 12M18 6 6 18"/>',
        down: '<path d="m6 9 6 6 6-6"/>',
        left: '<path d="m15 6-6 6 6 6"/>',
        right: '<path d="m9 6 6 6-6 6"/>',
        wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z"/><path d="M9 9.5c.3 2 2.3 4.2 4.6 4.8l1-1.1 2 1-.6 1.4c-3.6.4-7.6-3.4-7.3-7.1l1.4-.6 1 2-1.1.6"/>',
        scissors: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5 20 18M8.5 15.5 20 6"/>',
        shop: '<path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3Z"/><path d="M10 20v-5h4v5"/>',
        truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
        chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8M8 13h5"/>',
        ruler: '<path d="m3 17 14-14 4 4L7 21l-4-4Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
        spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
        hanger: '<path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.6-2 3l9 6.5c.8.6.4 1.5-.5 1.5h-17c-.9 0-1.3-.9-.5-1.5L12 8"/>',
        calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
        fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8Z"/>',
        ig: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>',
        tt: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.6 2.4 4.3 5 4.5"/>',
        filter: '<path d="M4 6h16M7 12h10M10 18h4"/>'
    };
    const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

    /* ------------------------------------------------------------------ data */
    const DATA = window.SITE_DATA || { products: [], announcements: [] };
    const ALL = (DATA.products || []).filter(p => !p.hidden && CAT[p.category]).map(p => ({
        ...p, id: Number(p.id), price: Number(p.price) || 0, was: Number(p.was) > Number(p.price) ? Number(p.was) : 0,
        colour: (p.colour || '').trim(), alt: p.hover && p.hover !== p.img ? p.hover : ''
    }));
    const byId = id => ALL.find(p => p.id === Number(id));
    const inCat = k => ALL.filter(p => p.category === k);
    const off = p => p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    const onSale = () => ALL.filter(p => p.was);
    const fresh = () => ALL.filter(p => /new/i.test(p.tag || ''));

    /* ------------------------------------------------------------------ bag + wishlist */
    const BAG_KEY = 'wl_mid_bag', WISH_KEY = 'wl_mid_wish';
    let bag = store.get(BAG_KEY, []).filter(l => byId(l.id));
    let wish = store.get(WISH_KEY, []).filter(id => byId(id));
    const bagCount = () => bag.reduce((n, l) => n + l.qty, 0);
    function saveBag() { store.set(BAG_KEY, bag); paintCounts(true); renderBag(); }
    function addToBag(id, size, qty = 1) {
        const p = byId(id); if (!p) return;
        const l = bag.find(x => x.id === p.id && x.size === size);
        l ? (l.qty += qty) : bag.push({ id: p.id, size, qty });
        saveBag();
        toast(p, 'Added to your bag');
    }
    function toggleWish(id, btn) {
        id = Number(id);
        const i = wish.indexOf(id);
        i < 0 ? wish.push(id) : wish.splice(i, 1);
        store.set(WISH_KEY, wish);
        $$(`.wish[data-id="${id}"]`).forEach(b => { b.classList.toggle('on', i < 0); b.setAttribute('aria-pressed', i < 0); });
        paintCounts(true);
        if (i < 0) toast(byId(id), 'Saved to your wishlist');
        if (document.body.dataset.page === 'shop' && filters.wish) runShop();
    }
    function paintCounts(bump) {
        const set = (sel, n) => $$(sel).forEach(el => { el.textContent = n; el.classList.toggle('on', n > 0); if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
        set('[data-ct=bag]', bagCount()); set('[data-ct=wish]', wish.length);
    }

    /* ------------------------------------------------------------------ product card */
    function card(p, i = 0, opts = {}) {
        const c = CAT[p.category];
        const pct = off(p);
        const w = wish.includes(p.id);
        const sizes = opts.sizes || '(max-width:640px) 50vw, (max-width:960px) 33vw, 22vw';
        return `<article class="card" style="--i:${i}">
            <a class="ph" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
                <img class="h1" src="${IMG(p.img, 600)}"${SRCSET(p.img, sizes)} alt="${esc(p.name)}" loading="lazy" style="object-position:${esc(p.pos || '50% 20%')}">
                ${HOVER && p.alt ? `<img class="h2" src="${IMG(p.alt, 600)}"${SRCSET(p.alt, sizes)} alt="" aria-hidden="true" loading="lazy" style="object-position:${esc(p.altPos || p.pos || '50% 20%')}">` : ''}
            </a>
            ${pct ? `<span class="badge">-${pct}%</span>` : ''}${p.tag && !/sale/i.test(p.tag) ? `<span class="tag">${esc(p.tag)}</span>` : ''}
            <button class="wish${w ? ' on' : ''}" data-id="${p.id}" aria-pressed="${w}" aria-label="Save ${esc(p.name)}">${ic('heart')}</button>
            <button class="quick" data-add="${p.id}">${ic('bag')} Add to bag</button>
            <div class="bd">
                <span class="cn">${esc(c.one)}</span>
                <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
                <div class="price${pct ? ' sale' : ''}">${pct ? `<s>${rs(p.was)}</s>` : ''}<b>${rs(p.price)}</b></div>
                <a class="btn btn-brand more" href="product.html?id=${p.id}">See more</a>
            </div>
        </article>`;
    }
    const firstSize = p => sizesFor(p)[0];
    function sizesFor(p) {
        if (p.category === 'saree') return ['Free size'];
        if (p.category === 'bridal') return ['Made to measure'];
        if (p.category === 'groom' || p.category === 'men') return ['36', '38', '40', '42', '44', '46'];
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }

    /* ------------------------------------------------------------------ header */
    function megaFor(keys, feat) {
        const items = ALL.filter(p => keys.includes(p.category));
        const colours = [...new Set(items.map(p => p.colour).filter(Boolean))].slice(0, 7);
        const f = feat || items[0];
        const base = keys.length === 1 ? `shop.html?cat=${keys[0]}` : `shop.html?cat=${keys.join(',')}`;
        return `<div class="mega"><div class="wrap">
            <div><h4>Shop</h4><ul>
                ${keys.map(k => `<li><a href="shop.html?cat=${k}">${esc(CAT[k].label)}</a></li>`).join('')}
                <li><a href="${base}&sort=new">New in</a></li>
                <li><a href="${base}&sale=1">On offer</a></li>
            </ul></div>
            <div><h4>By colour</h4><ul>${colours.map(c => `<li><a href="${base}&colour=${encodeURIComponent(c)}">${esc(c)}</a></li>`).join('')}</ul></div>
            <div><h4>By price</h4><ul>
                <li><a href="${base}&price=0-3000">Under Rs 3,000</a></li>
                <li><a href="${base}&price=3000-8000">Rs 3,000 to 8,000</a></li>
                <li><a href="${base}&price=8000-15000">Rs 8,000 to 15,000</a></li>
                <li><a href="${base}&price=15000-">Above Rs 15,000</a></li>
            </ul></div>
            ${f ? `<a class="feat" href="product.html?id=${f.id}"><img src="${IMG(f.img, 700)}" alt="" loading="lazy" style="object-position:${esc(f.pos || '50% 20%')}"><span>${esc(f.name)}<small>${f.was ? `Now ${rs(f.price)}` : 'Featured piece'}</small></span></a>` : ''}
        </div></div>`;
    }
    function header() {
        const page = document.body.dataset.page;
        const cur = new URLSearchParams(location.search).get('cat') || '';
        const curIs = keys => page === 'shop' && keys.some(k => cur.split(',').includes(k)) ? ' cur' : '';
        const ann = (DATA.announcements || []).length ? DATA.announcements : ['Example shop: all pieces, prices and photos are samples'];
        const tile = c => { const p = inCat(c.key)[0]; return `<a class="ct-tile" href="shop.html?cat=${c.key}">${p ? `<img src="${IMG(p.img, 300)}" alt="" loading="lazy" style="object-position:${esc(p.pos || '50% 20%')}">` : ''}${esc(c.label)}</a>`; };
        const hdr = `
        <div class="topbar"><div class="wrap">
            <div class="tb-l"><span>${ic('pin')} ${SHOP.boutiques.map(b => b.town).join(' & ')}</span></div>
            <div class="ann" aria-live="polite">${ann.map((a, i) => `<p class="${i ? '' : 'on'}">${esc(a)}</p>`).join('')}</div>
            <div class="tb-r"><a href="${wa('Hello ' + SHOP.name + '!')}">${ic('wa')} WhatsApp us</a><span>MUR (Rs)</span></div>
        </div></div>
        <header class="hdr" id="hdr">
            <div class="hdr-main"><div class="wrap">
                <div class="hdr-l"><button class="ic burger" data-open="menu" aria-label="Menu">${ic('menu')}</button><button class="ic s-tog" aria-label="Search">${ic('search')}</button></div>
                <a class="logo" href="./" aria-label="${esc(SHOP.name)}, home"><span class="mk">W</span><span><b>${esc(SHOP.short)}</b><small>High Fashion Boutique</small></span></a>
                <form class="search" role="search" action="shop.html">
                    <input name="q" type="search" placeholder="Search sarees, lehengas, sherwanis…" autocomplete="off" aria-label="Search the shop">
                    <button aria-label="Search">${ic('search')}</button>
                    <div class="sugg"></div>
                </form>
                <div class="hdr-act">
                    <a class="ic vis" href="contact.html">${ic('pin')}<span class="lb">Visit us</span></a>
                    <a class="ic" href="shop.html?wish=1" aria-label="Wishlist">${ic('heart')}<span class="lb">Wishlist</span><span class="ct" data-ct="wish">0</span></a>
                    <button class="ic" data-open="bag" aria-label="Bag">${ic('bag')}<span class="lb">Bag</span><span class="ct" data-ct="bag">0</span></button>
                </div>
            </div></div>
            <nav class="nav" aria-label="Main"><div class="wrap">
                <div class="dd"><button class="allc" aria-expanded="false">${ic('menu')} All categories</button><div class="mega all"><div class="wrap">${CATS.map(tile).join('')}</div></div></div>
                <a href="./" class="${page === 'home' ? 'cur' : ''}">Home</a>
                <div class="dd${curIs(['saree'])}"><button aria-expanded="false">Sarees ${ic('down')}</button>${megaFor(['saree'])}</div>
                <div class="dd${curIs(['bridal', 'lehenga'])}"><button aria-expanded="false">Lehengas ${ic('down')}</button>${megaFor(['bridal', 'lehenga'])}</div>
                <div class="dd${curIs(['gown'])}"><button aria-expanded="false">Suits &amp; Anarkalis ${ic('down')}</button>${megaFor(['gown'])}</div>
                <div class="dd${curIs(['groom', 'men'])}"><button aria-expanded="false">Men ${ic('down')}</button>${megaFor(['groom', 'men'])}</div>
                <a href="shop.html?sort=new" class="hide-md">New in</a>
                <a href="shop.html?sale=1" class="offer${page === 'shop' && new URLSearchParams(location.search).get('sale') ? ' cur' : ''}">Offers</a>
                <a href="contact.html" class="push${page === 'contact' ? ' cur' : ''}">Visit us</a>
            </div></nav>
        </header>
        <div class="scrim"></div>
        <aside class="drawer l" id="menu" aria-label="Menu" aria-hidden="true">
            <div class="drawer-h"><a class="logo" href="./"><span class="mk">W</span><span><b>${esc(SHOP.short)}</b></span></a><button class="x" data-close aria-label="Close">${ic('x')}</button></div>
            <div class="drawer-b"><ul class="m-nav">
                <li><a href="./">Home</a></li>
                ${[['Sarees', ['saree']], ['Lehengas', ['bridal', 'lehenga']], ['Suits & Anarkalis', ['gown']], ['Men', ['groom', 'men']]].map(([t, ks]) => `<li><button>${esc(t)} ${ic('down')}</button><div class="sub"><div>
                    ${ks.map(k => `<a href="shop.html?cat=${k}">${esc(CAT[k].label)} (${inCat(k).length})</a>`).join('')}
                    <a href="shop.html?cat=${ks.join(',')}&sale=1">On offer</a></div></div></li>`).join('')}
                <li><a href="shop.html?sort=new">New in</a></li>
                <li><a href="shop.html?sale=1" style="color:var(--sale)">Offers</a></li>
                <li><a href="shop.html?wish=1">Wishlist</a></li>
                <li><a href="contact.html">Visit us</a></li>
            </ul></div>
            <div class="drawer-f"><a class="btn btn-wa btn-block" href="${wa('Hello ' + SHOP.name + '!')}">${ic('wa')} WhatsApp us</a></div>
        </aside>
        <aside class="drawer r" id="bag" aria-label="Your bag" aria-hidden="true">
            <div class="drawer-h"><h3>Your bag</h3><button class="x" data-close aria-label="Close">${ic('x')}</button></div>
            <div class="drawer-b" id="bagBody"></div>
            <div class="drawer-f" id="bagFoot"></div>
        </aside>
        <div class="toast" role="status"></div>
        <div id="navbar"></div>`;
        $('#site-hdr').outerHTML = hdr;
    }

    function footer() {
        const cols = `
        <footer class="ftr">
            <div class="news"><div class="wrap">
                <div><h3>New pieces every week</h3><p>Get new arrivals and offers first. No spam, one message a week.</p></div>
                <form id="newsForm"><input type="email" required placeholder="Your email address" aria-label="Email address"><button class="btn btn-gold">Join</button></form>
            </div></div>
            <div class="wrap fcols">
                <div>
                    <a class="logo" href="./"><span class="mk">W</span><span><b>${esc(SHOP.short)}</b><small>High Fashion Boutique</small></span></a>
                    <p class="about">Sarees, bridal and party lehengas, suits, sherwanis and kurtas for every celebration in Mauritius.</p>
                    <div class="soc"><a href="https://www.facebook.com/" aria-label="Facebook">${ic('fb')}</a><a href="https://www.instagram.com/" aria-label="Instagram">${ic('ig')}</a><a href="https://www.tiktok.com/" aria-label="TikTok">${ic('tt')}</a><a href="${wa('Hello ' + SHOP.name + '!')}" aria-label="WhatsApp">${ic('wa')}</a></div>
                </div>
                <div><h4>Shop</h4><ul>${CATS.map(c => `<li><a href="shop.html?cat=${c.key}">${esc(c.label)}</a></li>`).join('')}<li><a href="shop.html?sale=1">Offers</a></li></ul></div>
                <div><h4>Help</h4><ul>
                    <li><a href="contact.html#how">How to order</a></li>
                    <li><a href="contact.html#faq">Sizes &amp; alterations</a></li>
                    <li><a href="contact.html#faq">Delivery</a></li>
                    <li><a href="contact.html#faq">Exchanges</a></li>
                    <li><a href="contact.html">Book a fitting</a></li>
                </ul></div>
                <div><h4>Visit &amp; delivery</h4><ul>
                    ${SHOP.boutiques.map(b => `<li class="ad">${ic('pin')}<span>${esc(b.street)}</span></li>`).join('')}
                    <li class="ad">${ic('wa')}<span><span class="ph-num">Your phone number</span></span></li>
                    <li style="margin-top:8px">Free delivery in Mauritius above ${rs(SHOP.freeDelivery)}.</li>
                </ul><div class="pay"><span>Juice</span><span>VISA</span><span>Mastercard</span><span>Cash</span></div></div>
            </div>
            <div class="wrap"><p class="demo-note">This is a demo website made by WebLuxe. All pieces, prices, offers, photos, names, addresses and opening hours are examples, and the WhatsApp and call buttons do not contact anyone.</p></div>
            <div class="fbot"><div class="wrap"><span>© <span>2026</span> ${esc(SHOP.name)}, Mauritius</span><span>Website built by <a href="https://webluxe.github.io/WebLuxe/" target="_blank" rel="noopener">WebLuxe</a></span></div></div>
        </footer>`;
        $('#site-ftr').outerHTML = cols;
    }

    /* ------------------------------------------------------------------ drawers, toast, bag */
    let lastFocus;
    function openDrawer(id) {
        lastFocus = document.activeElement;
        const d = document.getElementById(id);
        d.classList.add('on'); d.setAttribute('aria-hidden', 'false');
        $('.scrim').classList.add('on');
        document.body.style.overflow = 'hidden';
        setTimeout(() => d.querySelector('button, a')?.focus(), 50);
    }
    function closeDrawers() {
        $$('.drawer.on, .filters.on').forEach(d => { d.classList.remove('on'); d.setAttribute('aria-hidden', 'true'); });
        $('.scrim').classList.remove('on');
        document.body.style.overflow = '';
        lastFocus?.focus?.();
    }
    let toastT;
    function toast(p, msg) {
        const t = $('.toast');
        t.innerHTML = `${p ? `<img src="${IMG(p.img, 120)}" alt="">` : ''}<p>${esc(msg)}</p>${/bag/.test(msg) ? '<button type="button">View bag</button>' : ''}`;
        t.querySelector('button')?.addEventListener('click', () => { t.classList.remove('on'); openDrawer('bag'); });
        t.classList.add('on');
        clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200);
    }
    function renderBag() {
        const body = $('#bagBody'), foot = $('#bagFoot');
        if (!body) return;
        if (!bag.length) {
            body.innerHTML = `<div class="bag-empty">${ic('bag')}<p>Your bag is empty.</p><a class="btn btn-brand btn-sm" style="margin-top:16px" href="shop.html">Start shopping</a></div>`;
            foot.innerHTML = '';
            return;
        }
        let total = 0;
        body.innerHTML = bag.map((l, i) => {
            const p = byId(l.id); total += p.price * l.qty;
            return `<div class="bag-line"><a href="product.html?id=${p.id}"><img src="${IMG(p.img, 200)}" alt=""></a>
                <div><h4><a href="product.html?id=${p.id}">${esc(p.name)}</a></h4><div class="mt">${esc(CAT[p.category].one)} · ${esc(l.size)}</div><div class="pr">${rs(p.price * l.qty)}</div>
                <div class="qty"><button data-q="${i}" data-d="-1" aria-label="One less">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="One more">+</button></div></div>
                <button class="rm" data-rm="${i}">Remove</button></div>`;
        }).join('');
        const left = SHOP.freeDelivery - total;
        foot.innerHTML = `<div class="tot"><span>Total</span><b>${rs(total)}</b></div>
            <p class="tot-n">${left > 0 ? `Add ${rs(left)} more for free delivery.` : 'Free delivery in Mauritius.'} You pay when you collect or on delivery.</p>
            <a class="btn btn-wa btn-block" id="sendOrder" href="#">${ic('wa')} Send my order on WhatsApp</a>`;
        $('#sendOrder').href = wa(`Hello ${SHOP.name}, I would like to order:\n` + bag.map(l => { const p = byId(l.id); return `• ${p.name} (${l.size}) x${l.qty}: ${rs(p.price * l.qty)}`; }).join('\n') + `\nTotal: ${rs(total)}`);
    }

    /* ------------------------------------------------------------------ search with suggestions */
    function wireSearch() {
        const form = $('.search'); if (!form) return;
        const input = form.querySelector('input'), box = form.querySelector('.sugg');
        let hl = -1;
        const q0 = new URLSearchParams(location.search).get('q'); if (q0) input.value = q0;
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase(); hl = -1;
            if (q.length < 2) { box.classList.remove('on'); return; }
            const hits = ALL.filter(p => (p.name + ' ' + CAT[p.category].label + ' ' + p.colour).toLowerCase().includes(q)).slice(0, 6);
            box.innerHTML = hits.length ? hits.map(p => `<a href="product.html?id=${p.id}"><img src="${IMG(p.img, 100)}" alt=""><span>${esc(p.name)}</span><em>${rs(p.price)}</em></a>`).join('') + `<a href="shop.html?q=${encodeURIComponent(input.value.trim())}" style="justify-content:center;color:var(--brand);font-size:13px">See all results</a>`
                : `<p class="none">Nothing found for “${esc(input.value.trim())}”. Try “saree” or “red”.</p>`;
            box.classList.add('on');
        });
        input.addEventListener('keydown', e => {
            const links = $$('a', box); if (!links.length) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault(); hl = (hl + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
                links.forEach((a, i) => a.classList.toggle('hl', i === hl));
            } else if (e.key === 'Enter' && hl >= 0) { e.preventDefault(); links[hl].click(); }
        });
        document.addEventListener('click', e => { if (!form.contains(e.target)) box.classList.remove('on'); });
        $('.s-tog')?.addEventListener('click', () => { form.classList.toggle('on'); if (form.classList.contains('on')) input.focus(); });
    }

    /* ------------------------------------------------------------------ carousels */
    function wireRows(root = document) {
        $$('.row-wrap', root).forEach(w => {
            const row = $('.row', w), p = $('.arw.p', w), n = $('.arw.n', w);
            if (!row || !p) return;
            const upd = () => { p.disabled = row.scrollLeft < 8; n.disabled = row.scrollLeft + row.clientWidth > row.scrollWidth - 8; };
            const step = () => (row.firstElementChild?.offsetWidth || 240) + 20;
            p.onclick = () => row.scrollBy({ left: -step() * 2, behavior: 'smooth' });
            n.onclick = () => row.scrollBy({ left: step() * 2, behavior: 'smooth' });
            row.addEventListener('scroll', upd, { passive: true }); upd();
        });
    }
    const rowHTML = (items, label) => `<div class="row-wrap"><button class="arw p" aria-label="Previous">${ic('left')}</button><div class="row" role="list" aria-label="${esc(label)}">${items.map((p, i) => card(p, i, { sizes: '(max-width:640px) 62vw, (max-width:960px) 33vw, 20vw' })).join('')}</div><button class="arw n" aria-label="Next">${ic('right')}</button></div>`;

    /* ------------------------------------------------------------------ reveal */
    function reveal() {
        const els = $$('.rv:not(.in)');
        if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
        els.forEach(e => io.observe(e));
    }

    /* ================================================================== HOME */
    function home() {
        const pick = (k, n) => inCat(k).slice(0, n);
        const tr = [...onSale(), ...fresh()].filter((p, i, a) => a.indexOf(p) === i);
        const trending = (tr.length >= 8 ? tr : [...tr, ...ALL.filter(p => !tr.includes(p))]).slice(0, 12);
        const slide = (cls, k, head, text, cta, href, pics, offer) => `
            <div class="slide ${cls}"><div class="txt"><div class="bgp"></div><span class="k">${esc(k)}</span>${head}<p class="d">${esc(text)}</p>
                <div class="cta"><a class="btn btn-light" href="${href}">${esc(cta)}</a><a class="btn btn-line" style="color:#fff" href="contact.html">Book a fitting</a></div>${offer || ''}</div>
                <div class="pics">${pics.filter(Boolean).map((p, i) => `<figure><img src="${IMG(p.img, i ? 500 : 800)}" alt="${esc(p.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} style="object-position:${esc(p.pos || '50% 20%')}">${i === 0 ? `<figcaption>${esc(p.name)} · ${p.was ? `<b>${rs(p.price)}</b>` : rs(p.price)}</figcaption>` : ''}</figure>`).join('')}</div></div>`;
        const maxOff = Math.max(0, ...onSale().map(off));
        const html = `
        <section class="hero" aria-roledescription="carousel" aria-label="Highlights">
            <div class="slides">
                ${slide('s1 on', 'Wedding season 2027', '<h1>Bridal lehengas, <em>made for your day</em></h1>', 'Hand-embroidered lehengas in red, wine and gold, fitted to you in our boutique.', 'Shop bridal', 'shop.html?cat=bridal', pick('bridal', 3))}
                ${slide('s2', 'Festive offers', `<h2>The saree edit, <em>${maxOff ? 'up to ' + maxOff + '% off' : 'new this week'}</em></h2>`, 'Banarasi, Kanjeevaram, georgette and organza. Six yards for every occasion.', 'Shop sarees', 'shop.html?cat=saree', pick('saree', 3), maxOff ? `<p class="off"><b>-${maxOff}%</b> on selected pieces, while stocks last</p>` : '')}
                ${slide('s3', 'For him', '<h2>Sherwanis and kurtas <em>for the groom</em></h2>', 'Sherwanis, Nehru jackets and kurta sets for the groom, his brothers and every guest.', "Shop men's wear", 'shop.html?cat=groom,men', [...pick('groom', 2), ...pick('men', 1)])}
            </div>
            <div class="h-ctl"><button class="ar" data-h="-1" aria-label="Previous slide">${ic('left')}</button><div class="dots">${[0, 1, 2].map(i => `<button aria-label="Slide ${i + 1}" class="${i ? '' : 'on'}"><i></i></button>`).join('')}</div><button class="ar" data-h="1" aria-label="Next slide">${ic('right')}</button></div>
        </section>
        <div class="trust"><div class="wrap">
            <div>${ic('scissors')}<p><b>Free fitting</b><span>Alterations done in store</span></p></div>
            <div>${ic('shop')}<p><b>Two boutiques</b><span>${SHOP.boutiques.map(b => b.town).join(' & ')}</span></p></div>
            <div>${ic('chat')}<p><b>Order on WhatsApp</b><span>We reply within the hour</span></p></div>
            <div>${ic('truck')}<p><b>Island-wide delivery</b><span>Free above ${rs(SHOP.freeDelivery)}</span></p></div>
        </div></div>

        <section class="sec"><div class="wrap">
            <div class="sh sh-c rv"><div><p class="k">Everything Indian, under one roof</p><h2>Shop by category</h2></div></div>
            <div class="cats">${CATS.map((c, i) => { const p = inCat(c.key)[1] || inCat(c.key)[0]; return `<a class="cat rv" style="transition-delay:${i * 60}ms" href="shop.html?cat=${c.key}"><div class="ring">${p ? `<img src="${IMG(p.img, 360)}" alt="" loading="lazy" style="object-position:${esc(p.pos || '50% 20%')}">` : ''}</div><b>${esc(c.label)}</b><span>${inCat(c.key).length} pieces</span></a>`; }).join('')}</div>
        </div></section>

        <section class="sec mandala-band band-sand"><div class="wrap">
            <div class="sh rv"><div><p class="k">Trending now</p><h2>Offers and new arrivals</h2></div><a class="link" href="shop.html?sale=1">View all offers ${ic('right')}</a></div>
            <div class="rv">${rowHTML(trending, 'Trending now')}</div>
        </div></section>

        <section class="sec"><div class="wrap promos">
            ${promo('p1', 'The bridal studio', 'Your lehenga, fitted to you', 'Book a private fitting with tea, a mirror and our tailor on hand.', 'Book a fitting', 'contact.html', inCat('bridal')[3] || inCat('bridal')[0])}
            ${promo('p2', 'Suits & anarkalis', 'Easy festive dressing', 'Flowing anarkalis and suit sets for mehendi, haldi and Diwali.', 'Shop suits', 'shop.html?cat=gown', inCat('gown')[0])}
        </div></section>

        <section class="sec" style="padding-top:20px"><div class="wrap">
            <div class="sh sh-c rv"><div><p class="k">The collection</p><h2>Best of the season</h2></div></div>
            <div class="tabs rv" role="tablist">${CATS.map((c, i) => `<button role="tab" aria-selected="${!i}" data-tab="${c.key}">${esc(c.label)}</button>`).join('')}</div>
            <div class="grid tabpane" role="tabpanel"></div>
            <div class="center"><a class="btn btn-line" id="tabAll" href="shop.html">See all</a></div>
        </div></section>

        <section class="sec mandala-band jaal"><div class="wrap">
            <div class="sh rv"><div><p class="k">For him</p><h2>Groom &amp; men's wear</h2></div><a class="link" href="shop.html?cat=groom,men">View all ${ic('right')}</a></div>
            <div class="rv">${rowHTML([...inCat('groom'), ...inCat('men')], "Groom and men's wear")}</div>
        </div></section>

        <section class="sec"><div class="wrap">
            <div class="sh rv"><div><p class="k">Dress for the day</p><h2>Shop by occasion</h2></div></div>
            <div class="occ">
                ${occ('Wedding day', 'Bridal lehengas', 'shop.html?cat=bridal', inCat('bridal')[1])}
                ${occ('Reception', 'Party lehengas', 'shop.html?cat=lehenga', inCat('lehenga')[0])}
                ${occ('Mehendi & haldi', 'Suits & anarkalis', 'shop.html?cat=gown', inCat('gown')[1])}
                ${occ('Festivals & pujas', 'Silk sarees', 'shop.html?cat=saree', inCat('saree')[4])}
                ${occ('Baraat', 'Sherwanis', 'shop.html?cat=groom', inCat('groom')[0])}
                ${occ('Guests', 'Kurta sets', 'shop.html?cat=men', inCat('men')[0])}
            </div>
        </div></section>

        <section class="sec band-sand"><div class="wrap">
            <div class="sh sh-c rv"><div><p class="k">Simple and personal</p><h2>How to shop with us</h2></div></div>
            <div class="steps">
                <div class="step rv">${ic('hanger')}<b>Choose online</b><p>Browse every piece with its price. Save the ones you love.</p></div>
                <div class="step rv" style="transition-delay:.08s">${ic('chat')}<b>Message us</b><p>Send your bag on WhatsApp. We confirm sizes and colours.</p></div>
                <div class="step rv" style="transition-delay:.16s">${ic('ruler')}<b>Get fitted</b><p>Try it on in Rose Hill or Grand Baie. Alterations are free.</p></div>
                <div class="step rv" style="transition-delay:.24s">${ic('truck')}<b>Collect or delivery</b><p>Take it home, or we deliver anywhere in Mauritius.</p></div>
            </div>
        </div></section>

        <section class="sec"><div class="wrap">
            <div class="sh sh-c rv"><div><p class="k">Kind words</p><h2>What our customers say</h2><p>Example reviews for this demo.</p></div></div>
            <div class="revs">
                ${rev('My lehenga fitted perfectly after one alteration, and they had it ready two days early.', 'Priya', 'bride, example review')}
                ${rev('I sent my list on WhatsApp in the morning and tried everything on the same evening.', 'Anjali', 'example review')}
                ${rev('Found sherwanis for me and my two brothers in one visit. Great choice of colours.', 'Rohan', 'groom, example review')}
            </div>
        </div></section>

        <section class="sec" style="padding-top:0"><div class="wrap visit">
            <div class="vbox dark rv"><small>Visit us</small><h3>Try it on in person</h3><p>Two boutiques in Mauritius. Message us before you come and we will have your sizes ready.</p>
                <div class="acts"><a class="btn btn-gold" href="contact.html">${ic('calendar')} Book a fitting</a><a class="btn btn-wa" href="${wa('Hello ' + SHOP.name + ', I would like to visit.')}">${ic('wa')} WhatsApp</a></div></div>
            ${SHOP.boutiques.map((b, i) => `<div class="vbox rv" style="transition-delay:${(i + 1) * 80}ms"><small>${esc(b.town)}</small><h3>${esc(b.street)}</h3><p>${esc(b.note)}</p>
                <ul>${SHOP.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>
                <div class="acts"><a class="link" href="https://www.google.com/maps/search/?api=1&query=${b.map}" target="_blank" rel="noopener">Directions ${ic('right')}</a></div></div>`).join('')}
        </div></section>`;
        $('#page').innerHTML = html;

        /* hero slider */
        const hero = $('.hero'), slides = $$('.slide', hero), dots = $$('.dots button', hero);
        let cur = 0, timer;
        const go = i => {
            cur = (i + slides.length) % slides.length;
            slides.forEach((s, j) => s.classList.toggle('on', j === cur));
            dots.forEach((d, j) => { d.classList.remove('on'); if (j === cur) { void d.offsetWidth; d.classList.add('on'); } });
            restart();
        };
        const restart = () => { clearTimeout(timer); if (!REDUCED) timer = setTimeout(() => go(cur + 1), 6000); };
        $$('[data-h]', hero).forEach(b => b.onclick = () => go(cur + Number(b.dataset.h)));
        dots.forEach((d, j) => d.onclick = () => go(j));
        hero.addEventListener('mouseenter', () => { clearTimeout(timer); hero.classList.add('paused'); });
        hero.addEventListener('mouseleave', () => { hero.classList.remove('paused'); restart(); });
        let x0 = null;
        hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
        hero.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
        restart();

        /* collection tabs */
        const pane = $('.tabpane'), tabs = $$('.tabs button');
        let busy = false;
        const show = (k, animate) => {
            const put = () => {
                const list = inCat(k); pane.innerHTML = list.slice(0, list.length >= 8 ? 8 : Math.max(4, list.length - list.length % 4)).map((p, i) => card(p, i)).join('');
                pane.classList.remove('out');
                $('#tabAll').href = 'shop.html?cat=' + k;
                $('#tabAll').textContent = 'See all ' + CAT[k].label.toLowerCase();
            };
            if (!animate || REDUCED) return put();
            busy = true; pane.classList.add('out');
            setTimeout(() => { put(); busy = false; }, 260);
        };
        tabs.forEach((b, i) => b.addEventListener('click', () => {
            if (busy || b.getAttribute('aria-selected') === 'true') return;
            const was = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
            tabs.forEach(t => { t.setAttribute('aria-selected', t === b); t.style.setProperty('--o', i > was ? 'left' : 'right'); });
            show(b.dataset.tab, true);
        }));
        show(CATS[0].key, false);
    }
    const promo = (cls, k, h, p, cta, href, pc) => `<a class="promo ${cls} rv" href="${href}"><div class="pt"><small>${esc(k)}</small><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="btn btn-light btn-sm">${esc(cta)}</span></div><figure>${pc ? `<img src="${IMG(pc.img, 600)}" alt="" loading="lazy" style="object-position:${esc(pc.pos || '50% 20%')}">` : ''}</figure></a>`;
    const occ = (t, s, href, p) => `<a class="rv" href="${href}">${p ? `<img src="${IMG(p.img, 700)}" alt="" loading="lazy" style="object-position:${esc(p.pos || '50% 20%')}">` : ''}<span>${esc(t)}<small>${esc(s)}</small></span></a>`;
    const rev = (t, n, w) => `<figure class="rev rv" style="margin:0"><div class="st" aria-hidden="true">★★★★★</div><p>“${esc(t)}”</p><footer><b>${esc(n)}</b>, ${esc(w)}</footer></figure>`;

    /* ================================================================== SHOP */
    const filters = { cats: [], colours: [], price: '', sale: false, wish: false, q: '', sort: 'featured' };
    function shop() {
        const u = new URLSearchParams(location.search);
        filters.cats = (u.get('cat') || '').split(',').filter(k => CAT[k]);
        filters.colours = (u.get('colour') || '').split(',').filter(Boolean);
        filters.price = u.get('price') || '';
        filters.sale = !!u.get('sale'); filters.wish = !!u.get('wish');
        filters.q = (u.get('q') || '').trim();
        filters.sort = u.get('sort') || 'featured';
        const title = filters.wish ? 'Your wishlist' : filters.sale ? 'Offers' : filters.cats.length === 1 ? CAT[filters.cats[0]].label : filters.cats.length && filters.cats.every(k => CAT[k].group === 'lehenga') ? 'Lehengas' : filters.cats.length && filters.cats.every(k => CAT[k].group === 'men') ? "Men's wear" : filters.q ? `Search: “${filters.q}”` : filters.sort === 'new' ? 'New in' : 'The full collection';
        const colours = [...new Set(ALL.map(p => p.colour).filter(Boolean))].sort();
        document.title = title + ' | ' + SHOP.name;
        $('#page').innerHTML = `
        <div class="pban jaal"><div class="wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="./">Home</a><span>Shop</span>${filters.cats.length === 1 ? `<span>${esc(CAT[filters.cats[0]].label)}</span>` : ''}</nav>
            <h1>${esc(title)}</h1><p>${filters.wish ? 'The pieces you saved. They stay in this browser.' : 'Every piece with its price. Message us on WhatsApp for sizes and colours.'}</p></div></div>
        <div class="wrap shop">
            <aside class="filters" id="filters" aria-label="Filters">
                <div class="drawer-h" style="padding:0 0 14px;border:0" data-mobile><h3>Filters</h3><button class="x" data-close aria-label="Close">${ic('x')}</button></div>
                <div class="fg"><h4>Category <button class="clear" data-clear="cats">Clear</button></h4>${CATS.map(c => `<label><input type="checkbox" name="cat" value="${c.key}"${filters.cats.includes(c.key) ? ' checked' : ''}> ${esc(c.label)} <em>${inCat(c.key).length}</em></label>`).join('')}</div>
                <div class="fg"><h4>Price</h4>${[['', 'Any price'], ['0-3000', 'Under Rs 3,000'], ['3000-8000', 'Rs 3,000 to 8,000'], ['8000-15000', 'Rs 8,000 to 15,000'], ['15000-', 'Above Rs 15,000']].map(([v, l]) => `<label><input type="radio" name="price" value="${v}"${filters.price === v ? ' checked' : ''}> ${l}</label>`).join('')}</div>
                ${colours.length ? `<div class="fg"><h4>Colour <button class="clear" data-clear="colours">Clear</button></h4><div class="sw">${colours.map(c => `<button type="button" data-colour="${esc(c)}" title="${esc(c)}" aria-label="${esc(c)}" aria-pressed="${filters.colours.includes(c)}" class="${filters.colours.includes(c) ? 'on' : ''}" style="background:${SWATCH[c.toLowerCase()] || '#ccc'}"></button>`).join('')}</div></div>` : ''}
                <div class="fg"><label><input type="checkbox" name="sale"${filters.sale ? ' checked' : ''}> On offer only <em>${onSale().length}</em></label><label><input type="checkbox" name="wish"${filters.wish ? ' checked' : ''}> My wishlist</label></div>
                <button class="btn btn-brand btn-block" data-close style="margin-top:16px" data-mobile>Show pieces</button>
            </aside>
            <div>
                <div class="tools"><button class="btn btn-line btn-sm fbtn" data-filters>${ic('filter')} Filters</button><p class="cnt"></p>
                    <label><span class="sr">Sort</span><select id="sort">${[['featured', 'Featured'], ['new', 'Newest first'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['off', 'Biggest discount']].map(([v, l]) => `<option value="${v}"${filters.sort === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label></div>
                <div class="chips"></div>
                <div class="grid g3 fade" id="results"></div>
            </div>
        </div>`;
        const mobile = matchMedia('(max-width:960px)');
        const syncMobile = () => $$('[data-mobile]').forEach(e => e.style.display = mobile.matches ? '' : 'none');
        syncMobile(); mobile.addEventListener?.('change', syncMobile);

        const F = $('#filters');
        F.addEventListener('change', e => {
            const t = e.target;
            if (t.name === 'cat') filters.cats = $$('input[name=cat]:checked', F).map(i => i.value);
            if (t.name === 'price') filters.price = t.value;
            if (t.name === 'sale') filters.sale = t.checked;
            if (t.name === 'wish') filters.wish = t.checked;
            runShop(true);
        });
        F.addEventListener('click', e => {
            const s = e.target.closest('[data-colour]');
            if (s) { const c = s.dataset.colour; filters.colours = filters.colours.includes(c) ? filters.colours.filter(x => x !== c) : [...filters.colours, c]; s.classList.toggle('on'); s.setAttribute('aria-pressed', s.classList.contains('on')); runShop(true); }
            const cl = e.target.closest('[data-clear]');
            if (cl) { filters[cl.dataset.clear] = []; $$(cl.dataset.clear === 'cats' ? 'input[name=cat]' : '[data-colour]', F).forEach(i => { i.checked = false; i.classList?.remove('on'); }); runShop(true); }
        });
        $('#sort').addEventListener('change', e => { filters.sort = e.target.value; runShop(true); });
        $('[data-filters]').addEventListener('click', () => { lastFocus = document.activeElement; F.classList.add('on'); $('.scrim').classList.add('on'); document.body.style.overflow = 'hidden'; });
        $('.chips').addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            const [k, v] = b.dataset.rm.split(':');
            if (k === 'cat') filters.cats = filters.cats.filter(x => x !== v);
            if (k === 'colour') filters.colours = filters.colours.filter(x => x !== v);
            if (k === 'price') filters.price = '';
            if (k === 'sale') filters.sale = false;
            if (k === 'wish') filters.wish = false;
            if (k === 'q') { filters.q = ''; const i = $('.search input'); if (i) i.value = ''; }
            shop(); history.replaceState(null, '', urlFor()); runShop();
        });
        runShop();
    }
    function urlFor() {
        const u = new URLSearchParams();
        if (filters.cats.length) u.set('cat', filters.cats.join(','));
        if (filters.colours.length) u.set('colour', filters.colours.join(','));
        if (filters.price) u.set('price', filters.price);
        if (filters.sale) u.set('sale', '1');
        if (filters.wish) u.set('wish', '1');
        if (filters.q) u.set('q', filters.q);
        if (filters.sort !== 'featured') u.set('sort', filters.sort);
        const s = u.toString(); return 'shop.html' + (s ? '?' + s : '');
    }
    function runShop(push) {
        if (push) history.replaceState(null, '', urlFor());
        const [lo, hi] = filters.price ? filters.price.split('-').map(v => v === '' ? null : Number(v)) : [null, null];
        const q = filters.q.toLowerCase();
        let list = ALL.filter(p =>
            (!filters.cats.length || filters.cats.includes(p.category)) &&
            (!filters.colours.length || filters.colours.includes(p.colour)) &&
            (lo == null || p.price >= lo) && (hi == null || p.price < hi) &&
            (!filters.sale || p.was) && (!filters.wish || wish.includes(p.id)) &&
            (!q || (p.name + ' ' + CAT[p.category].label + ' ' + p.colour).toLowerCase().includes(q)));
        const s = filters.sort;
        if (s === 'low') list.sort((a, b) => a.price - b.price);
        if (s === 'high') list.sort((a, b) => b.price - a.price);
        if (s === 'off') list.sort((a, b) => off(b) - off(a));
        if (s === 'new') list.sort((a, b) => (/new/i.test(b.tag) - /new/i.test(a.tag)) || b.id - a.id);
        $('.cnt').innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'piece' : 'pieces'}`;
        const chips = [
            ...filters.cats.map(k => ['cat:' + k, CAT[k].label]), ...filters.colours.map(c => ['colour:' + c, c]),
            ...(filters.price ? [['price:', { '0-3000': 'Under Rs 3,000', '3000-8000': 'Rs 3,000 to 8,000', '8000-15000': 'Rs 8,000 to 15,000', '15000-': 'Above Rs 15,000' }[filters.price] || filters.price]] : []),
            ...(filters.sale ? [['sale:', 'On offer']] : []), ...(filters.wish ? [['wish:', 'Wishlist']] : []), ...(filters.q ? [['q:', '“' + filters.q + '”']] : [])];
        $('.chips').innerHTML = chips.map(([k, l]) => `<button data-rm="${esc(k)}">${esc(l)} ${ic('x')}</button>`).join('');
        const R = $('#results');
        R.classList.remove('fade'); void R.offsetWidth; R.classList.add('fade');
        R.innerHTML = list.length ? list.map((p, i) => card(p, Math.min(i, 12), { sizes: '(max-width:640px) 50vw, (max-width:960px) 33vw, 25vw' })).join('')
            : `<div class="empty" style="grid-column:1/-1"><h3>${filters.wish ? 'No saved pieces yet' : 'Nothing matches'}</h3><p>${filters.wish ? 'Tap the heart on any piece to save it here.' : 'Try fewer filters, or ask us: we get new pieces every week.'}</p>
               <a class="btn btn-wa" href="${wa(`Hello ${SHOP.name}, I am looking for ${filters.q || 'a piece'}.`)}">${ic('wa')} Ask us on WhatsApp</a></div>`;
    }

    /* ================================================================== PRODUCT */
    const STORY = {
        saree: ['Six yards of {c} with a woven zari border and a rich pallu. Comes with an unstitched blouse piece; we stitch it to your measurements.', 'Silk blend with zari work', ['Saree length 5.5 m plus 0.8 m blouse piece', 'Blouse stitching to measure available', 'Fall and pico included']],
        bridal: ['A {c} bridal lehenga with hand embroidery, a full flared skirt and a matching dupatta. Fitted to you in the boutique, with as many fittings as you need.', 'Raw silk and velvet with zardozi and sequin work', ['Lehenga, blouse and dupatta', 'Made to measure, ready in 3 to 4 weeks', 'Can-can and lining included']],
        lehenga: ['A light {c} lehenga for receptions, sangeet nights and parties. Easy to move and dance in, with a ready blouse that we adjust to fit.', 'Georgette and net with thread and sequin work', ['Lehenga, blouse and dupatta', 'Blouse adjusted in store', 'Lined skirt']],
        gown: ['A {c} suit set with a flowing silhouette and fine embroidery at the neck and hem. Easy to wear from mehendi to Diwali.', 'Georgette and cotton silk', ['Kurta or anarkali, bottom and dupatta', 'Free length and sleeve alterations', 'Fully lined']],
        groom: ['A {c} sherwani with embroidery on the collar and front, cut slim with a matching churidar. Add a stole and safa to finish the look.', 'Jacquard silk with thread work', ['Sherwani and churidar', 'Stole and safa available', 'Alterations included']],
        men: ['A {c} kurta set in a comfortable festive fabric, easy to wear all day at weddings and pujas.', 'Cotton silk blend', ['Kurta and pyjama', 'Nehru jacket available', 'Sleeve and length alterations included']]
    };
    function product() {
        const id = Number(new URLSearchParams(location.search).get('id'));
        const p = byId(id) || ALL[0];
        if (!p) { $('#page').innerHTML = '<div class="wrap sec"><h1>No pieces yet</h1></div>'; return; }
        const c = CAT[p.category], st = STORY[p.category], pct = off(p);
        const shots = [p.img, p.alt].filter(Boolean);
        const sizes = sizesFor(p);
        const w = wish.includes(p.id);
        document.title = p.name + ' | ' + SHOP.name;
        const similar = ALL.filter(x => x.category === p.category && x.id !== p.id);
        const more = [...similar, ...ALL.filter(x => CAT[x.category].group === c.group && x.category !== p.category)].slice(0, 10);
        $('#page').innerHTML = `
        <div class="wrap"><nav class="crumb" aria-label="Breadcrumb" style="padding-top:22px"><a href="./">Home</a><span><a href="shop.html?cat=${p.category}">${esc(c.label)}</a></span><span>${esc(p.name)}</span></nav></div>
        <div class="wrap pd">
            <div class="gal">
                <div class="thumbs"${shots.length < 2 ? ' hidden' : ''}>${shots.map((s, i) => `<button class="${i ? '' : 'on'}" data-shot="${esc(s)}" aria-label="Photo ${i + 1}"><img src="${IMG(s, 200)}" alt=""></button>`).join('')}</div>
                <div class="main-ph">${pct ? `<span class="badge">-${pct}%</span>` : ''}<img id="mainPh" src="${IMG(p.img, 1000)}"${SRCSET(p.img, '(max-width:960px) 100vw, 46vw')} alt="${esc(p.name)}" style="object-position:${esc(p.pos || '50% 20%')}"></div>
            </div>
            <div class="info">
                <p class="cn">${esc(c.one)}${p.tag && !/sale/i.test(p.tag) ? ' · ' + esc(p.tag) : ''}</p>
                <h1>${esc(p.name)}</h1>
                <div class="price${pct ? ' sale' : ''}">${pct ? `<s>${rs(p.was)}</s>` : ''}<b>${rs(p.price)}</b>${pct ? `<span class="save">You save ${rs(p.was - p.price)}</span>` : ''}</div>
                <p class="ex">Example price and photo for this demo.</p>
                <p class="lead">${esc(st[0].replace('{c}', (p.colour || 'rich').toLowerCase()))}</p>
                ${p.colour ? `<div class="opt"><h4>Colour: ${esc(p.colour)}</h4><div class="sw"><button type="button" class="on" style="background:${SWATCH[p.colour.toLowerCase()] || '#ccc'}" aria-label="${esc(p.colour)}"></button></div></div>` : ''}
                <div class="opt"><h4>Size <a href="contact.html#faq">Size help</a></h4><div class="sizes" role="radiogroup" aria-label="Size">${sizes.map((s, i) => `<button type="button" role="radio" aria-checked="${!i}" class="${i ? '' : 'on'}">${esc(s)}</button>`).join('')}</div></div>
                <div class="buy">
                    <div class="qty"><button type="button" data-pq="-1" aria-label="One less">−</button><span id="pq">1</span><button type="button" data-pq="1" aria-label="One more">+</button></div>
                    <button class="btn btn-brand" id="addBag">${ic('bag')} Add to bag</button>
                    <button class="wish${w ? ' on' : ''}" data-id="${p.id}" aria-pressed="${w}" aria-label="Save to wishlist">${ic('heart')}</button>
                </div>
                <a class="btn btn-wa btn-block" id="askWa" href="#">${ic('wa')} Ask about this piece on WhatsApp</a>
                <div class="mini"><div>${ic('scissors')}Free alterations</div><div>${ic('shop')}Try on in store</div><div>${ic('truck')}Island-wide delivery</div></div>
                <div class="acc">
                    <details open><summary>Details</summary><div class="ab"><ul>${st[2].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></details>
                    <details><summary>Fabric &amp; care</summary><div class="ab"><p>${esc(st[1])}. Dry clean only. Store folded in a muslin cloth, away from damp.</p></div></details>
                    <details><summary>Delivery &amp; exchanges</summary><div class="ab"><p>Collect from Rose Hill or Grand Baie, or delivery anywhere in Mauritius in 2 to 4 days (free above ${rs(SHOP.freeDelivery)}). Exchange within 7 days if unworn with tags.</p></div></details>
                </div>
            </div>
        </div>
        ${more.length ? `<section class="sec mandala-band band-sand"><div class="wrap"><div class="sh"><div><p class="k">You may also like</p><h2>More ${esc(c.label.toLowerCase())}</h2></div><a class="link" href="shop.html?cat=${p.category}">View all ${ic('right')}</a></div>${rowHTML(more, 'You may also like')}</div></section>` : ''}`;

        let size = sizes[0], qty = 1;
        $$('.sizes button').forEach(b => b.addEventListener('click', () => { $$('.sizes button').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); }); b.classList.add('on'); b.setAttribute('aria-checked', 'true'); size = b.textContent; upWa(); }));
        $$('[data-pq]').forEach(b => b.addEventListener('click', () => { qty = Math.max(1, Math.min(9, qty + Number(b.dataset.pq))); $('#pq').textContent = qty; }));
        $('#addBag').addEventListener('click', () => addToBag(p.id, size, qty));
        const upWa = () => { $('#askWa').href = wa(`Hello ${SHOP.name}, is the ${p.name} (${rs(p.price)}, size ${size}) available?`); };
        upWa();
        const main = $('#mainPh'), box = $('.main-ph');
        $$('.thumbs button').forEach(b => b.addEventListener('click', () => {
            $$('.thumbs button').forEach(x => x.classList.toggle('on', x === b));
            main.style.opacity = 0;
            setTimeout(() => { main.removeAttribute('srcset'); main.src = IMG(b.dataset.shot, 1000); main.style.opacity = 1; }, 180);
        }));
        if (HOVER) {
            box.addEventListener('mousemove', e => { const r = box.getBoundingClientRect(); main.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; });
            box.addEventListener('mouseenter', () => box.classList.add('zoom'));
            box.addEventListener('mouseleave', () => box.classList.remove('zoom'));
        }
    }

    /* ================================================================== CONTACT */
    function contact() {
        $('#page').innerHTML = `
        <div class="pban jaal"><div class="wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="./">Home</a><span>Visit us</span></nav><h1>Visit us &amp; book a fitting</h1><p>Two boutiques in Mauritius. Tell us when you are coming and we will have your pieces and sizes ready.</p></div></div>
        <div class="wrap ct-grid">
            <div>
                <div class="visit" style="grid-template-columns:1fr">
                    ${SHOP.boutiques.map(b => `<div class="vbox"><small>${esc(b.town)}</small><h3>${esc(b.street)}</h3><p>${esc(b.note)}</p><ul>${SHOP.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>
                        <div class="acts"><a class="btn btn-line btn-sm" href="https://www.google.com/maps/search/?api=1&query=${b.map}" target="_blank" rel="noopener">${ic('pin')} Directions</a><a class="btn btn-line btn-sm" href="tel:">Call <span class="ph-num">Your phone number</span></a></div></div>`).join('')}
                </div>
                <div id="how" class="vbox dark" style="margin-top:20px"><small>How to order</small><h3>Three easy ways</h3><p>1. Add pieces to your bag and send it on WhatsApp. 2. Message us a photo of what you like. 3. Come to a boutique and try everything on.</p></div>
            </div>
            <div>
                <form class="form" id="bookForm">
                    <h2>Book a fitting</h2><p>Pick a day and we confirm on WhatsApp.</p>
                    <div class="fl"><label class="fld">Your name<input name="n" required autocomplete="name"></label><label class="fld">Phone<input name="p" type="tel" autocomplete="tel" placeholder="5xxx xxxx"></label></div>
                    <div class="fl"><label class="fld">Boutique<select name="b">${SHOP.boutiques.map(b => `<option>${esc(b.town)}</option>`).join('')}</select></label><label class="fld">Day<input name="d" type="date" required></label></div>
                    <label class="fld">Looking for<select name="w">${CATS.map(c => `<option>${esc(c.label)}</option>`).join('')}<option>Not sure yet</option></select></label>
                    <label class="fld">Anything else?<textarea name="m" placeholder="Event date, colours you like, sizes…"></textarea></label>
                    <button class="btn btn-wa btn-block">${ic('wa')} Send on WhatsApp</button>
                </form>
                <div class="acc faq" id="faq">
                    <details open><summary>How do sizes work?</summary><div class="ab"><p>Sarees are free size and we stitch the blouse to your measurements. Bridal lehengas are made to measure. Other pieces come in XS to XXL (women) or 36 to 46 (men), and we alter them for free.</p></div></details>
                    <details><summary>Do you deliver?</summary><div class="ab"><p>Yes, anywhere in Mauritius in 2 to 4 days. Free above ${rs(SHOP.freeDelivery)}, otherwise Rs 200.</p></div></details>
                    <details><summary>Can I exchange a piece?</summary><div class="ab"><p>Within 7 days if it is unworn and has its tags. Made-to-measure pieces cannot be exchanged.</p></div></details>
                    <details><summary>How do I pay?</summary><div class="ab"><p>Cash, card or Juice in the boutique, or on delivery.</p></div></details>
                </div>
            </div>
        </div>`;
        const d = $('#bookForm [name=d]'); d.min = new Date().toISOString().slice(0, 10);
        $('#bookForm').addEventListener('submit', e => {
            e.preventDefault();
            const f = new FormData(e.target);
            open(wa(`Hello ${SHOP.name}, I would like to book a fitting.\nName: ${f.get('n')}\nPhone: ${f.get('p') || '-'}\nBoutique: ${f.get('b')}\nDay: ${f.get('d')}\nLooking for: ${f.get('w')}\n${f.get('m') || ''}`.trim()), '_blank');
        });
    }

    /* ================================================================== start */
    header(); footer();
    const page = document.body.dataset.page;
    ({ home, shop, product, contact }[page] || (() => {}))();
    paintCounts(false); renderBag(); wireSearch(); wireRows(); reveal();

    /* announcements */
    const anns = $$('.ann p');
    if (anns.length > 1 && !REDUCED) {
        let a = 0;
        setInterval(() => { anns[a].classList.remove('on'); anns[a].classList.add('out'); const o = anns[a]; setTimeout(() => o.classList.remove('out'), 600); a = (a + 1) % anns.length; anns[a].classList.add('on'); }, 4200);
    }
    /* sticky header shadow */
    const hdrEl = $('#hdr');
    const onScroll = () => hdrEl.classList.toggle('stuck', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* clicks */
    document.addEventListener('click', e => {
        const t = e.target;
        const op = t.closest('[data-open]'); if (op) { e.preventDefault(); openDrawer(op.dataset.open); return; }
        if (t.closest('[data-close]') || t.classList.contains('scrim')) { closeDrawers(); return; }
        const wb = t.closest('.wish[data-id]'); if (wb) { e.preventDefault(); toggleWish(wb.dataset.id); return; }
        const ad = t.closest('[data-add]'); if (ad) { e.preventDefault(); const p = byId(ad.dataset.add); addToBag(p.id, firstSize(p)); return; }
        const q = t.closest('[data-q]'); if (q) { const l = bag[q.dataset.q]; l.qty += Number(q.dataset.d); if (l.qty < 1) bag.splice(q.dataset.q, 1); saveBag(); return; }
        const rm = t.closest('[data-rm]'); if (rm && rm.closest('#bagBody')) { bag.splice(rm.dataset.rm, 1); saveBag(); return; }
        const mb = t.closest('.m-nav > li > button'); if (mb) { mb.parentElement.classList.toggle('open'); return; }
        const dd = t.closest('.dd > button');
        if (dd) { const d = dd.parentElement, was = d.classList.contains('open'); $$('.dd.open').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (!was) { d.classList.add('open'); dd.setAttribute('aria-expanded', 'true'); } return; }
        if (!t.closest('.mega')) $$('.dd.open').forEach(x => x.classList.remove('open'));
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawers(); $$('.dd.open').forEach(x => x.classList.remove('open')); } });
    $('#newsForm')?.addEventListener('submit', e => { e.preventDefault(); e.target.innerHTML = '<p style="color:#fff;padding:12px 0">Thank you! (Demo: no email is saved.)</p>'; });

    /* ------------------------------------------------------------------ page changes */
    const root = document.documentElement;
    const VT = 'CSSViewTransitionRule' in window;
    if (!VT) root.classList.add('no-vt');
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
        if (!/\.html$|\/$/.test(url.pathname)) return;
        root.classList.add('leaving');
        if (VT || REDUCED) return;               // the browser animates the change itself
        e.preventDefault();
        setTimeout(() => { location.href = url.href; }, 240);
    });
    addEventListener('pageshow', () => root.classList.remove('leaving'));

    /* ------------------------------------------------------------------ first-visit loader */
    const loader = $('#loader');
    if (loader && !root.classList.contains('seen')) {
        const t0 = performance.now();
        const done = () => { setTimeout(() => { loader.classList.add('off'); try { sessionStorage.setItem('wl_mid_seen', '1'); } catch (e) { /* */ } }, Math.max(0, (REDUCED ? 200 : 1500) - (performance.now() - t0))); };
        document.readyState === 'complete' ? done() : addEventListener('load', done);
        setTimeout(() => loader.classList.add('off'), 3500);
    }
})();
