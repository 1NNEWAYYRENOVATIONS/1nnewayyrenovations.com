1NNEWAYY RENOVATIONS LLC — WEBSITE FOUNDATION LOCK
Last updated: 2026-10-12

LOCKED PAGE ADDED
- Page: thank-you.html
- Status: Approved and included in the website foundation lock.
- Canonical page source: https://github.com/1NNEWAYYRENOVATIONS/1nnewayyrenovations.com/blob/main/thank-you.html
- Live page: https://www.1nnewayyrenovations.com/thank-you.html
- Background asset: thank-you-page-approved-optimized.webp

LOCKED DESIGN REQUIREMENTS
- Preserve the approved black-and-metallic-gold treatment, centered confirmation panel, gold border, typography, spacing, and proportional sizing.
- Preserve the nighttime luxury-home background and existing shared site header.
- Use the same shared Lock Foundation footer markup and styles as the rest of the website.
- Keep the confirmation message and functional “Return to Website” link.
- Preserve estimate submission flow: estimate.html redirects to thank-you.html.
- Treat this page as an approved locked page. Future site-wide revisions must not alter its approved layout, treatments, footer, or behavior without explicit authorization.

IMPLEMENTATION RECORD
- Latest approved proportional sizing commit: 237f9f27b69c38a2afca6f60aa5eb286b8c745b1
- Shared footer implementation commit: 6093c7aeca78834f5edf2d48426ebc28aa26b881


FOOTER LOGO CENTERING — FOUNDATION LOCK UPDATE (2026-10-12)
- Applied site-wide through the shared styles.css footer classes.
- Footer logo is centered horizontally and vertically within its existing designated brand/grid section.
- Existing grid dimensions, logo sizing, gold treatments, dividers, estimate button, Call Us action, copyright placement, and responsive footer layout are preserved.
- Applies to all pages using .site-footer.mockup-footer, including thank-you.html.
- CSS commit: 2df73ca94d4e1a0c328cd449ba29cdf9ef1f579c

APPROVED SHARED FOOTER — FOUNDATION LOCK (2026-10-12)
- The supplied footer reference image is the authoritative visual standard for the shared website footer.
- Apply the same footer consistently to every primary website page, including thank-you.html, through the shared .site-footer.mockup-footer markup and styles.
- Layout, left to right: brand logo centered horizontally and vertically within its designated left grid section; gold vertical divider; centered gold-gradient “Request Onsite Estimate” button; gold vertical divider; circular gold phone icon and “Call US” action.
- Place the centered copyright line beneath the main footer row: “© 2025 1NNEWAYY RENOVATIONS LLC. All Rights Reserved.”
- Preserve the black background, thin metallic-gold top border, existing gold tones, typography, button treatment, icon styling, dividers, row proportions, and established footer sizing.
- Center the logo only within its existing designated section. Do not shift the other columns or change the grid, logo dimensions, button placement, call placement, or copyright alignment as part of this logo-centering revision.
- Preserve responsive behavior at tablet and mobile breakpoints.
- This footer is now a locked foundational component. Any future site-wide change to its visual treatment, dimensions, order, spacing, or behavior requires explicit authorization.
- Source of truth: styles.css selectors .site-footer.mockup-footer and .mockup-footer-*; all pages using this shared footer must remain synchronized.

BLOG ARTICLE PAGES — SHARED FOUNDATION LOCK (2026-10-13)
- The three approved Blog article pages are now synchronized to one shared stylesheet: `/blog-article-foundation.css`.
- Canonical approved article pages:
  - `blog/articles/drywall-repair-vs-replacement/index.html`
  - `blog/articles/lvp-flooring-riverview-fl/index.html`
  - `blog/articles/lvp-vs-carpet-florida-home/index.html`
- The shared stylesheet contains the exact common article-page styling, including black/metallic-gold visual treatment, article typography and section rules, responsive breakpoints, header layout, and the approved shared footer treatment.
- Do not duplicate the article CSS inline in new article pages. Link to `/blog-article-foundation.css` so future foundation corrections propagate to every article using it.
- Reusable authoring template: `BLOG_ARTICLE_TEMPLATE.html.txt`. This is a source template, not a live page. Replace every `{{PLACEHOLDER}}`, write original article content, and publish the finished article as `blog/articles/<article-slug>/index.html`.
- Locked header navigation for article pages:
  - Home: `/`
  - Blogs: `/blog.html`
  - Request Estimate: `/estimate.html` (must go directly to the dedicated Request Estimate page, never `/#estimate`)
  - Call US: `tel:+18889138677`
- Locked footer: retain the exact `.site-footer.mockup-footer` markup and class names from the template; footer logo `/logo.png`; Request Onsite Estimate `/estimate.html`; Call US `tel:+18889138677`; copyright text exactly `© 2025 1NNEWAYY RENOVATIONS LLC. All Rights Reserved.`
- Preserve article-specific canonical URL, Open Graph and Twitter metadata, Article and BreadcrumbList structured data, GA4 measurement ID `G-KPD96277PQ`, and article-specific text/category. Ensure all placeholders are replaced before publishing.
- Future article pages must use the shared foundation and reusable template. Any intentional visual or navigation exception requires explicit authorization.
- Latest shared stylesheet commit: `17d40bff315cb059ac0938f628a1c30c7ca33f61`.
- Latest shared-template commit: `3e364e57f37945b042bf4b68cc254594ebafb3ea`.
