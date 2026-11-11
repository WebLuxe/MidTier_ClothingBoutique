# WebLuxe High Fashion Boutique: Business demo

The middle tier of the WebLuxe clothing-shop demos: a complete shop on one page, in maroon and gold, with the full set of effects.
Live: https://webluxe.github.io/MidTier_ClothingBoutique/

All pieces, prices, photos, names and addresses are examples. In demo mode the WhatsApp and call buttons show a popup instead of contacting anyone.

## What it has
- Collection with categories, search, sort and "show more"; quick view for each piece
- Wishlist and bag, sent as one order on WhatsApp
- Bride & Groom section, boutiques, booking form that opens WhatsApp
- Opening curtain with a mandala and gold dust (short version on repeat visits), silk-pleat curtain between sections, rising gold dust in the hero, rotating announcements
- `/admin`: owner panel (demo mode keeps changes in the visitor's browser)

## Files
| File | What it does |
|---|---|
| `index.html` | The whole site |
| `data.js` | Products and announcements (written by the owner panel) |
| `tw.css` | Built styles. After adding new classes: `npx tailwindcss@3.4.17 -c tailwind.config.js -i tw.src.css -o tw.css --minify` |
| `demo/` | Demo mode, demo label and "Compare packages" |
| `admin/` | Owner panel |

For a real client: set the WhatsApp number in `SHOP` in `index.html`, replace the example details, and remove the `demo/` scripts.

Website built by [WebLuxe](https://webluxe.github.io/WebLuxe/).
