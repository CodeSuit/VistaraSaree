# VISTARA | Heirloom Handloom Sarees & Bridal Silks

An ultra-luxury, high-conversion static website built for **Vistara**, a premier Indian handloom and bridal saree brand. The brand celebrates the timeless weaving heritages of Kanchipuram, Varanasi, Chanderi, Paithani, and organza silks.

---

## 🌟 Brand & Design Highlights

- **Aesthetic**: Royal heritage Indian luxury — deep crimson/burgundy (`#54121d`), antique gold (`#c59b27`), warm ivory (`#faf7f2`), and emerald accents.
- **Typography**: Google Fonts `Cinzel` (Royal display headings), `Cormorant Garamond` (Classic editorial serif), and `Plus Jakarta Sans` (Clean modern body).
- **Responsive**: Fully responsive grid across 4K displays, desktops, tablets, and smartphones.

---

## 🚀 Key Features & Capabilities

1. **Sticky Glassmorphic Header & Announcement Bar**:
   - Live promotional ticker with promo code `VISTARA10` for 10% discount.
   - Live multi-currency selector (₹ INR, $ USD, € EUR, £ GBP, AED) that updates all catalog prices dynamically.
   - Quick navigation links with active indicators and festive tags.
   - Action buttons for predictive search, live bridal wishlist counter, shopping bag counter, and VIP bridal appointment booking.

2. **Interactive Product Catalog (`products.js` & `app.js`)**:
   - 12 authentic handloom sarees with high-res imagery, dual hover drape view (body & pallu detail), certified Silk Mark badges, fabric specifications, and pure gold zari details.
   - Interactive category filtering: Kanjivaram, Banarasi, Organza, Chanderi, Paithani, and Bridal Edit.
   - Real-time sorting: Heirloom Featured, Price Low-to-High, Price High-to-Low, and Connoisseur Rating.

3. **Slide-out Cart Drawer with Free Shipping Meter**:
   - Live bag drawer with item counts and price recalculation.
   - Free shipping progress bar (threshold ₹50,000 / $600).
   - Quantity stepper and item removal.
   - Promotional code engine (e.g. `VISTARA10` or `ROYALVISTARA` for 10% instant discount).
   - Simulated Concierge Checkout modal with unique order reference generation.
   - Full persistence across page reloads via `localStorage`.

4. **Product Quick View Modal**:
   - High-resolution modal with thumbnail switcher.
   - Weave specifications (loom type, origin, zari composition, dimensions).
   - Blouse service selector: *Unstitched (Included)* or *Bespoke Tailored (+₹2,499)*.
   - Add directly to Bag or Wishlist.

5. **Bridal Wishlist Drawer**:
   - Favourites drawer with one-click "Move to Bag" capability.

6. **Predictive Search Modal**:
   - Real-time search by weave type, fabric, origin, or color with instant visual dropdown.

7. **Bespoke VIP Appointment Booking**:
   - Modal for scheduling in-person bridal consultations at flagship salons (Mumbai, Delhi, Bangalore) or 1-on-1 4K video shopping calls.

8. **Comprehensive Multi-Page Architecture**:
   - `index.html`: Flagship homepage featuring editorial hero banner, weave pillars, bestseller catalog, craftsmanship story ("The Soul of the Loom"), lookbook draping masterclass, bride reviews, VIP newsletter, and rich footer.
   - `collections.html`: Deep catalog page with dedicated sticky sidebar filters, item count indicator, and direct URL parameter support (`?category=kanjivaram`).
   - `about.html`: Brand story, Silk Mark certification breakdown, weaving clusters guide, and a 4-step Saree Connoisseur Care Guide.
   - `contact.html`: Boutique salon directory with addresses, phone numbers, hours, WhatsApp concierge link, and interactive FAQ accordion.

---

## 📁 File Structure

```
vistara-sarees/
├── index.html          # Flagship Home Page
├── collections.html    # Full Catalog & Faceted Filters
├── about.html          # Heritage, Looms & Saree Care Guide
├── contact.html        # Boutiques, WhatsApp & FAQs
├── style.css           # Master Luxury Stylesheet
├── products.js         # Curated Handloom Dataset & Utilities
├── app.js              # State Management, Cart, Modals & Currency
└── README.md           # Documentation & Overview
```

---

## 💻 How to View the Website

You can open `index.html` directly in any modern browser:
- On Windows: Double-click `index.html` or run:
  ```powershell
  Start-Process "C:\Users\vikas\.gemini\antigravity\scratch\vistara-sarees\index.html"
  ```
- Or run any static web server (such as Live Server in VS Code, `npx serve`, or Python's `http.server`).
