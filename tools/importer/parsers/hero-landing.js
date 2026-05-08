/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-landing variant.
 * Base block: hero
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Instances: #promo--435069566, .concierge-component
 * Generated: 2026-05-08
 *
 * Structure (3 rows): row 1 = block name, row 2 = background image, row 3 = title + text + CTA
 * Handles two DOM patterns:
 *   1. Promo v2 (#promo--435069566): Full-width banner with .versionB-image background,
 *      h1.versionB-heading, div.versionB-description, a.versionB-button CTA
 *   2. Concierge (.concierge-component): Full-width background with img.image-concierge-reference,
 *      h2.concierge-heading-txt, p.concierge-description-txt with embedded links
 */
export default function parse(element, { document }) {
  // Detect which pattern we're dealing with
  const isPromoV2 = element.querySelector('.promo-v2-versionB-main-frame, .versionB-image') !== null;
  const isConcierge = element.querySelector('.concierge-main-div, .concierge-heading-txt') !== null;

  let bgImage = null;
  const contentCell = [];

  if (isPromoV2) {
    // Pattern 1: Promo v2 component
    bgImage = element.querySelector('img.versionB-image, img#versionB-image');

    const heading = element.querySelector('h1.versionB-heading, h1.promo-header1, h1');
    const description = element.querySelector('div.versionB-description, .versionB-textContent-overlay div:not(.versionB-button-div)');
    const ctaLink = element.querySelector('a.versionB-button, .versionB-button-div a.button');

    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);

  } else if (isConcierge) {
    // Pattern 2: Concierge component
    bgImage = element.querySelector('img.image-concierge-reference');

    const heading = element.querySelector('h2.concierge-heading-txt');
    const description = element.querySelector('p.concierge-description-txt');
    // Extract links from within the description (ul > li > a pattern)
    const linkList = element.querySelector('.text-overlay ul');
    const ctaLink = element.querySelector('a.concierge-button');

    if (heading) contentCell.push(heading);
    if (description) {
      // Clone description text without the embedded ul (we handle links separately)
      const descText = description.childNodes[0];
      if (descText && descText.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descText.textContent.trim();
        contentCell.push(p);
      }
    }
    if (linkList) contentCell.push(linkList);
    if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);

  } else {
    // Fallback: attempt generic extraction for hero-like patterns
    bgImage = element.querySelector('img[class*="image"], img[class*="bg"], img');
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const description = element.querySelector('p, div[class*="description"]');
    const ctaLink = element.querySelector('a.button, a[class*="button"]');

    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);
  }

  // Build cells: row 1 = background image, row 2 = content (heading + text + CTA in single cell)
  // Each row is an array of columns. Wrapping contentCell in another array makes it a single-column row.
  const cells = [];
  if (bgImage) {
    cells.push([bgImage]);
  }
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
