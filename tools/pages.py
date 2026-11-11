"""Writes the HTML pages of the Business demo. Run: python tools/pages.py
Every page shares the same head, loader and scripts; app.js builds the rest."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
NAME = 'WebLuxe High Fashion Boutique'
PAGES = {
    'index.html': ('home', f'{NAME} | Sarees, Lehengas & Sherwanis in Mauritius', 'Sarees, bridal and party lehengas, suits, sherwanis and kurtas. Two boutiques in Rose Hill and Grand Baie. Order on WhatsApp.'),
    'shop.html': ('shop', f'Shop | {NAME}', 'Every piece with its price: sarees, lehengas, suits, sherwanis and kurtas.'),
    'product.html': ('product', f'Piece | {NAME}', 'A piece from the WebLuxe collection.'),
    'contact.html': ('contact', f'Visit us | {NAME}', 'Visit our boutiques in Rose Hill and Grand Baie, or book a fitting.'),
}
HEAD = '''<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0a2f2f">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%230f4c4b'/%3E%3Ctext x='32' y='44' font-family='Georgia' font-size='34' text-anchor='middle' fill='%23e7c27a'%3EW%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="demo/demo.css">
<link rel="stylesheet" href="demo/tiers.css">
<script>document.documentElement.classList.remove('no-js');try{{if(sessionStorage.getItem('wl_mid_seen'))document.documentElement.classList.add('seen')}}catch(e){{}}</script>
</head>
<body data-page="{page}">
<div id="loader" aria-hidden="true"><div class="jl"></div><div class="lc"><div class="mono">W</div><div class="nm">WEBLUXE</div><div class="sub">High Fashion Boutique</div><div class="bar"><i></i></div></div></div>
<div id="site-hdr"></div>
<main id="page"></main>
<div id="site-ftr"></div>
<script src="data.js"></script>
<script>window.WL_DEMO = {{ admin: 'admin/' }};</script>
<script src="demo/demo.js"></script>
<script src="assets/app.js"></script>
<script src="demo/tiers.js"></script>
</body>
</html>
'''
for f, (page, title, desc) in PAGES.items():
    (ROOT / f).write_text(HEAD.format(title=title, desc=desc, page=page), encoding='utf-8')
# 404: works on GitHub Pages and locally (absolute links to the site root)
(ROOT / '404.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | {NAME}</title>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500&family=Marcellus&display=swap" rel="stylesheet">
<style>body{{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a2f2f;color:#fff;font:16px/1.6 Jost,system-ui,sans-serif;text-align:center;padding:24px}}h1{{font:400 44px/1.1 Marcellus,Georgia,serif;margin:0 0 10px}}p{{color:#cfc8b8}}a{{display:inline-block;margin-top:22px;padding:13px 26px;border-radius:99px;background:#e7c27a;color:#0a2f2f;text-decoration:none;font-weight:500;letter-spacing:.1em;text-transform:uppercase;font-size:13px}}</style></head>
<body><div><p style="letter-spacing:.3em;text-transform:uppercase;font-size:12px;color:#e7c27a">Error 404</p><h1>This page is not here</h1><p>The piece may have sold out or the link has changed.</p><a href="/MidTier_ClothingBoutique/">Back to the shop</a></div></body></html>''', encoding='utf-8')
print('pages written')
