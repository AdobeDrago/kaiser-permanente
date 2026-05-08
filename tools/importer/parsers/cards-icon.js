/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base block: cards
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Selector: .banner-component
 * Generated: 2026-05-08
 *
 * Structure (from authoring analysis):
 *   2 columns per row: icon | label + link
 *   First content row contains intro content (heading, subheading, description)
 *   Subsequent rows contain one card each (icon | label + link)
 */
export default function parse(element, { document }) {
  // Extract heading content
  const heading = element.querySelector('h2.banner-component-mainHeading, h2[class*="mainHeading"]');
  const subHeading = element.querySelector('h3.banner-component-subHeading, h3[class*="subHeading"]');
  const description = element.querySelector('p.banner-component-discription, p[class*="discription"], p[class*="description"]');

  // Extract icon card items
  const iconDivs = element.querySelectorAll('.banner-component-iconDiv, [class*="iconDiv"]');

  const cells = [];

  // First row: intro content (heading + subheading + description in a single cell)
  const introCell = [];
  if (heading) introCell.push(heading);
  if (subHeading) introCell.push(subHeading);
  if (description) introCell.push(description);
  if (introCell.length > 0) {
    cells.push([introCell]);
  }

  // Subsequent rows: one row per icon card (icon | label + link)
  iconDivs.forEach((iconDiv) => {
    const icon = iconDiv.querySelector('.banner-component-icon, img[class*="icon"]');
    const textContainer = iconDiv.querySelector('.banner-component-iconText, [class*="iconText"]');

    const labelEl = textContainer ? textContainer.querySelector('b') : null;
    const linkEl = textContainer ? textContainer.querySelector('a') : null;

    const leftCell = [];
    if (icon) leftCell.push(icon);

    const rightCell = [];
    if (labelEl) rightCell.push(labelEl);
    if (linkEl) rightCell.push(linkEl);

    if (leftCell.length > 0 || rightCell.length > 0) {
      cells.push([leftCell, rightCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
