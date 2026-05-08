/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature variant.
 * Base block: cards
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Selector: .card-pattern-component
 * Generated: 2026-05-08
 *
 * Structure: Each row = one card with 2 cells:
 *   Cell 1: card image
 *   Cell 2: title + description + CTA link
 *
 * Source DOM structure:
 *   .feature-card-container (repeated per card)
 *     .feature-thumbnail-image > img
 *     .feature-card-content
 *       .feature-card-title (div)
 *       .feature-card-summary (div)
 *     .CTA-link-container > a
 *
 * Note: The section heading (.feature-card-component-heading) is default content
 * and is NOT included in this block parser.
 */
export default function parse(element, { document }) {
  // Select all card containers - each .feature-card-container is one card
  const cardContainers = element.querySelectorAll('.feature-card-container');

  const cells = [];

  cardContainers.forEach((card) => {
    // Cell 1: Card image
    const image = card.querySelector('.feature-thumbnail-image img, .feature-card-image, img[id="feature-card-image"]');

    // Cell 2: Title + Description + CTA
    const title = card.querySelector('.feature-card-title, [class*="feature-card-title"]');
    const summary = card.querySelector('.feature-card-summary, [class*="feature-card-summary"]');
    const ctaLink = card.querySelector('.CTA-link-container a, [class*="CTA"] a');

    // Build content cell
    const contentCell = [];
    if (title) {
      // Convert the title div to a paragraph with strong for semantic heading
      const titleEl = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      titleEl.appendChild(strong);
      contentCell.push(titleEl);
    }
    if (summary) {
      const summaryEl = document.createElement('p');
      summaryEl.textContent = summary.textContent.trim();
      contentCell.push(summaryEl);
    }
    if (ctaLink) {
      // Clone the link but remove the inline arrow image
      const link = ctaLink.cloneNode(true);
      const arrowImg = link.querySelector('img');
      if (arrowImg) arrowImg.remove();
      link.textContent = link.textContent.trim();
      const linkWrapper = document.createElement('p');
      linkWrapper.appendChild(link);
      contentCell.push(linkWrapper);
    }

    // Build row: [image cell, content cell]
    const imageCell = image ? [image] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
