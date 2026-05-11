/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-highlight variant.
 * Base block: cards
 * Source: https://choose.kaiserpermanente.org/pshb/plans
 * Selector: .card-pattern-component
 * Generated: 2026-05-11
 *
 * Structure: Each row = one highlight card with a single cell containing:
 *   - Card title (heading)
 *   - Card description/summary text
 *   - "Learn more" CTA link
 *
 * This variant is text-only (no images), unlike cards-feature which includes
 * thumbnail images.
 *
 * On some pages, the .card-pattern-component may be used as a video container
 * with the actual highlight cards in a sibling .highlights-component. On others,
 * it may directly contain feature-card-container elements (without images).
 * The parser handles both structures and gracefully produces an empty block
 * when no substantive card content exists (e.g. dynamically loaded cards that
 * require region selection).
 *
 * Pattern A (highlights-component, found as sibling):
 *   .highlight-card (repeated per card)
 *     .highlight-card-content
 *       .text-content
 *         .highlight-card-heading (title)
 *         .highlights-card-description (summary)
 *       a.highlights-URL (CTA link, e.g. "Learn More")
 *
 * Pattern B (card-pattern-component with feature cards, no images):
 *   .feature-card-container (repeated per card)
 *     .feature-card-content
 *       .feature-card-title (title)
 *       .feature-card-summary (summary)
 *     .CTA-link-container > a (CTA link)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which source element has the actual card content
  let sourceEl = element;

  // Check if element itself has highlight or feature cards
  const hasHighlightCards = element.querySelectorAll('.highlight-card').length > 0;
  const hasFeatureCards = element.querySelectorAll('.feature-card-container').length > 0;

  // If no cards in the matched element, look for a sibling .highlights-component
  if (!hasHighlightCards && !hasFeatureCards) {
    const parentGrid = element.closest('.aem-Grid');
    if (parentGrid) {
      const highlightsComp = parentGrid.querySelector('.highlights-component');
      if (highlightsComp) {
        sourceEl = highlightsComp;
      }
    }
    // Also try parent responsivegrid's parent
    if (sourceEl === element) {
      const parentResponsive = element.closest('.responsivegrid');
      if (parentResponsive && parentResponsive.parentElement) {
        const highlightsComp = parentResponsive.parentElement.querySelector('.highlights-component');
        if (highlightsComp) {
          sourceEl = highlightsComp;
        }
      }
    }
  }

  // Pattern A: highlight-card structure
  const highlightCards = sourceEl.querySelectorAll('.highlight-card');

  // Pattern B: feature-card structure (fallback)
  const featureCards = sourceEl.querySelectorAll('.feature-card-container');

  if (highlightCards.length > 0) {
    highlightCards.forEach((card) => {
      const contentCell = [];

      // Title
      const heading = card.querySelector('.highlight-card-heading, [class*="highlight-card-heading"]');
      const headingText = heading ? heading.textContent.trim() : '';
      if (headingText) {
        const titleEl = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = headingText;
        titleEl.appendChild(strong);
        contentCell.push(titleEl);
      }

      // Description
      const description = card.querySelector('.highlights-card-description, [class*="highlights-card-description"]');
      const descText = description ? description.textContent.trim() : '';
      if (descText) {
        const descEl = document.createElement('p');
        descEl.textContent = descText;
        contentCell.push(descEl);
      }

      // CTA link
      const ctaLink = card.querySelector('a.highlights-URL, a[class*="highlights-URL"]');
      if (ctaLink && ctaLink.href && ctaLink.textContent.trim()) {
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim().replace(/\s+/g, ' ');
        const linkWrapper = document.createElement('p');
        linkWrapper.appendChild(link);
        contentCell.push(linkWrapper);
      }

      // Only add the card row if it has substantive content (title or description)
      // Skip cards that are empty shells (dynamically populated but not loaded)
      if (headingText || descText) {
        cells.push([contentCell]);
      }
    });
  } else if (featureCards.length > 0) {
    // Fallback to feature-card structure but without image cell
    featureCards.forEach((card) => {
      const contentCell = [];

      const title = card.querySelector('.feature-card-title, [class*="feature-card-title"]');
      const titleText = title ? title.textContent.trim() : '';
      if (titleText) {
        const titleEl = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        titleEl.appendChild(strong);
        contentCell.push(titleEl);
      }

      const summary = card.querySelector('.feature-card-summary, [class*="feature-card-summary"]');
      const summaryText = summary ? summary.textContent.trim() : '';
      if (summaryText) {
        const summaryEl = document.createElement('p');
        summaryEl.textContent = summaryText;
        contentCell.push(summaryEl);
      }

      const ctaLink = card.querySelector('.CTA-link-container a, [class*="CTA"] a');
      if (ctaLink) {
        const link = ctaLink.cloneNode(true);
        const arrowImg = link.querySelector('img');
        if (arrowImg) arrowImg.remove();
        link.textContent = link.textContent.trim();
        const linkWrapper = document.createElement('p');
        linkWrapper.appendChild(link);
        contentCell.push(linkWrapper);
      }

      // Only add card if it has title or description
      if (titleText || summaryText) {
        cells.push([contentCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-highlight', cells });
  element.replaceWith(block);
}
