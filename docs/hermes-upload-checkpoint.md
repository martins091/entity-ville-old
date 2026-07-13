# Hermes Catalogue Upload Checkpoint

Source PDF: `/Users/theoneglobal/Downloads/Hermes Catalogue for Earthing.pdf`

Batch 001 uploaded to Supabase products table on 2026-06-06.

Uploaded count: 53 product-family records.

Batch 002 uploaded to Supabase products table on 2026-06-08.

Uploaded count: 48 product-family records.

Total Hermes records currently uploaded: 101 product-family records.

Pricing status: quote-only. All uploaded Hermes catalogue records use `price: 0` because the PDF contains product codes/specifications but no selling prices.

Image status: temporary storefront images from the existing site were used. We have not yet extracted and uploaded the real catalogue images from the PDF.

Covered sections:
- Earthing Conductors, catalogue pages 12-17.
- E.S.E Air Terminals and related tester, catalogue pages 56-58.
- Lightning protection pole/base/accessory families, sampled from pages 63-86.
- Earthing component families from the catalogue index.
- Exothermic Welding Systems, started with product selection chart families BB1, BB3, BB7, BB14, and BB41 from pages 90-92.
- Exothermic Welding Systems, continued with BE, BY, KB, KK, KE, KD, KY connection families from pages 93-117.
- HerWeld mould, powder, handle clamp, igniter, cleaning, and corrosion accessories from pages 118-120.
- Aircraft Warning System products from pages 124-125.

Last uploaded item:
- `hermes-medium-intensity-awl` - Hermes Medium Intensity AWL.

Continue from:
- Revisit catalogue pages 18-55 for skipped lightning protection and grounding families.
- Revisit catalogue pages 72-86 if the client wants every fixing clamp/base as its own detailed product instead of family-level products.
- Extract and upload real product images from the PDF.
- Add selling prices when the client provides them.

Recommended next improvement:
- Add a product variants/specification table to the database so each product family can contain many catalogue product codes without crowding the storefront.
