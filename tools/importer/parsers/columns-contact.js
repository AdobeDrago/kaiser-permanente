/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-contact variant.
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Selector: .plans-support-component
 * Generated: 2026-05-08
 *
 * Extracts contact columns (heading + description with phone/links) from
 * the plan support component. Skips empty columns.
 */
export default function parse(element, { document }) {
  // Find all columns within the plan support component
  const columns = element.querySelectorAll(
    '[class*="planSupport-column"], .planSupport-mainFrame > div'
  );

  // Build a single row with one cell per non-empty column
  const rowCells = [];

  columns.forEach((col) => {
    const heading = col.querySelector(
      'h3.planSupport-field-heading, h3[id^="planSupport-heading"], h3, h2'
    );
    const description = col.querySelector(
      'p.planSupport-field-description, p[id^="planSupport-description"], p'
    );

    // Skip columns that have no meaningful content
    const headingText = heading ? heading.textContent.trim() : '';
    const descText = description ? description.textContent.trim() : '';
    if (!headingText && !descText) return;

    // Build cell content array with heading and description
    const cellContent = [];
    if (heading && headingText) cellContent.push(heading);
    if (description && descText) cellContent.push(description);

    if (cellContent.length > 0) {
      rowCells.push(cellContent);
    }
  });

  // Columns block: single row with multiple cells (one per column)
  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
