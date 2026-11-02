# BOUCHRA — Modest Fashion website

A WhatsApp-first fashion catalogue. There is no online checkout or payment: every order is sent to BOUCHRA as a WhatsApp message and confirmed personally.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Homepage |
| `collection.html` | Full catalogue with collection filters (`?category=abayas`, `?filter=new`, `?filter=best`) |
| `product.html?id=…` | Product page with the **Order via WhatsApp** button |
| `admin.html` | Catalogue manager for the owner (not linked from the site, `noindex`) |

Shared on every page: the floating WhatsApp button, **My Selection** (request list sent as one WhatsApp message) and the size guide.

## Languages

English, French and Arabic (right-to-left). Visitors switch with the EN / FR / عربي buttons in the header (or in the mobile menu and footer); the choice is remembered. A link can force a language with `?lang=fr` or `?lang=ar`. Without a saved choice, the browser language is used, then English.

- Interface text lives in `js/i18n.js`.
- Catalogue text (products, colours, collections, homepage, delivery info) is stored as `{ "en": …, "fr": …, "ar": … }` in `data/catalog.js`. An empty translation falls back to English; the admin flags products missing French or Arabic.
- WhatsApp messages are written in the visitor’s language.
- The logo sits at the start of the header: left in English/French, right in Arabic. Arabic uses Noto Naskh Arabic and Tajawal, since Playfair Display and Montserrat have no Arabic characters.

## Where the content lives

All products and settings are in **one file: `data/catalog.js`**. No product is hard-coded in the pages.

- `settings.whatsappNumber`: the WhatsApp business number, in international format (e.g. `2126XXXXXXXX`). **Still empty, waiting for the real number.** Until it is set, WhatsApp asks the customer to choose a contact.
- `settings.siteUrl`: optional public address used in the product links inside messages.
- `settings.homepage`: announcement bar, hero and WhatsApp promotion texts.
- `products`, `categories`, `sizeGuide`.

## Updating the catalogue (owner)

1. Open `admin.html` on the website.
2. Add or edit products, photos, prices (MAD), sizes, colours, availability and the New / Best seller tags. Set the WhatsApp number and homepage texts.
3. Click **Preview site** to see the draft on the real pages (only in your browser).
4. Click **Download catalog.js** and upload it to the hosting, replacing `data/catalog.js`. Upload any photos you added by path to `img/products/`.

The draft is stored in the browser, so the admin page cannot change the live site by itself. Only uploading `catalog.js` publishes changes.

## Photos

Each colour of a product can have its own photos (`colours[].images`, or the colour's photo strip in the admin); they replace the gallery when a customer picks that colour. The abaya colour variants (`img/products/<colour>-abaya-1/2.jpg`) were digitally recoloured from the sand abaya, and model faces carry a soft white veil (70% opacity). Unedited photos are kept in `img/products/originals/`.

The current photos are crops of the brand moodboard and the products are **sample data**. Replace them with the real collection and high-resolution photography (ideally at least 1200 px wide, portrait 3:4).

## Running locally

Open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000
```
