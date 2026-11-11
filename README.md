# WebLuxe High Fashion Boutique: Business demo

The middle tier of the WebLuxe clothing-shop demos: an organised online shop in peacock teal and gold, laid out like a big department-store catalogue.
Live: https://webluxe.github.io/MidTier_ClothingBoutique/

All pieces, prices, offers, photos, names and addresses are examples. In demo mode the WhatsApp and call buttons show a popup instead of contacting anyone.

## What it has
- Header with search suggestions, dropdown menus (by type, colour and price), wishlist and bag
- Home: banner slider, category circles, offers row, promo banners, tabbed collection, men's row, shop by occasion, how to order, boutiques
- Shop page with filters (category, price, colour, offers, wishlist) and sorting; a page for every piece with photos, sizes, bag and WhatsApp
- Sale prices: add `"was"` (the old price) to a piece in `data.js` and it shows the strike-through price and the % badge
- Short loader on the first visit, smooth page changes, bag sent as one order on WhatsApp
- `/admin`: owner panel (demo mode keeps changes in the visitor's browser)

## Files
| File | What it does |
|---|---|
| `index.html`, `shop.html`, `product.html`, `contact.html`, `404.html` | Page shells, written by `python tools/pages.py` |
| `assets/app.js` | Builds the header, menus, footer, bag and every page |
| `assets/style.css` | All styles; colours are at the top |
| `data.js` | Pieces and announcements (written by the owner panel) |
| `demo/` | Demo mode, demo label and "Compare packages" |

For a real client: set `whatsapp` in `SHOP` at the top of `assets/app.js`, replace the example details, and remove the `demo/` scripts.

Website built by [WebLuxe](https://webluxe.github.io/WebLuxe/).
