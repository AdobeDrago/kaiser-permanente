/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-plan variant.
 * Base block: cards
 * Source: https://choose.kaiserpermanente.org/pshb/plans
 * Selector: .plans-summary
 * Generated: 2026-05-11
 *
 * Structure: Each row = one plan card with a single cell containing:
 *   - Plan name heading (e.g. "High Option", "Standard Option", "Prosper")
 *   - "Best Option if you" subheading + bullet list
 *   - "Plan features" subheading + bullet list
 *
 * Source DOM structure:
 *   .plans-summary-main-div
 *     .summary_titleDiv (section heading - default content, excluded)
 *     p.summary_mainDescription (section intro - default content, excluded)
 *     .summary-container
 *       .summary-child1, .summary-child2, .summary-child3 (one per plan)
 *         .summary-title-card.summaryCardParent
 *           .summary-card-heading (plan name)
 *         .summary-card.summaryCardParent (repeated per content group)
 *           .summarys-card-description
 *             h3 + ul (subheading + bullet list)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each summary-child div represents one plan column
  const planColumns = element.querySelectorAll('.summary-container > [class*="summary-child"]');

  planColumns.forEach((column) => {
    // Get plan name from title card
    const titleCard = column.querySelector('.summary-title-card .summary-card-heading, [class*="summary-card-heading"]');

    // Get all description cards (non-title cards)
    const descriptionCards = column.querySelectorAll('.summary-card .summarys-card-description, [class*="summarys-card-description"]');

    // Build the content cell
    const contentCell = [];

    // Plan name as strong heading
    if (titleCard) {
      const heading = document.createElement('h3');
      heading.textContent = titleCard.textContent.trim();
      contentCell.push(heading);
    }

    // Each description card contains an h3 + ul (e.g. "Best Option if you" + bullets)
    descriptionCards.forEach((desc) => {
      const subHeading = desc.querySelector('h3');
      if (subHeading) {
        const h4 = document.createElement('h4');
        h4.textContent = subHeading.textContent.trim();
        contentCell.push(h4);
      }

      const bulletList = desc.querySelector('ul');
      if (bulletList) {
        contentCell.push(bulletList.cloneNode(true));
      }
    });

    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-plan', cells });
  element.replaceWith(block);
}
