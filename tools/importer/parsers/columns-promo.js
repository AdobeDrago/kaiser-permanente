/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo variant.
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Instances: #promo-2016534242, .responsivegrid.two-col.aem-GridColumn--default--12:has(.gs-image-core), .wellness-rewards
 * Generated: 2026-05-08
 *
 * Structure: Two-column layout with image on one side and text content on the other.
 * Handles three DOM patterns:
 *   1. Promo component (#promo-*): .promo-image + .promo-content (h3, p, ul, a.button)
 *   2. Responsive grid (.responsivegrid.two-col): .gs-image-core img + .gs-container blocks (h3, ul, a.button)
 *   3. Wellness component (.wellness-rewards): img.wellness-image + h2/p/button content
 */
export default function parse(element, { document }) {
  // Detect which pattern we're dealing with
  const isPromoComponent = element.querySelector('.main-frame-promo, .promo-content-div') !== null;
  const isWellnessComponent = element.querySelector('.wellness-main-div, .wellness-component-mainFrame') !== null;
  // Otherwise it's the responsivegrid two-col pattern

  // Extract the image element across all patterns
  const image = element.querySelector(
    'img.promo-image, img.sectionImage, .gs-image-core img, .cmp-image__image, img.wellness-image, img#wellness-image'
  );

  // Build the text content cell based on the detected pattern
  const textCell = [];

  if (isPromoComponent) {
    // Pattern 1: Promo component - h2 title above, h3 subheading, paragraph, list, button
    const heading = element.querySelector('.promo-title-div h2, h2.promo-title, h2.sectionTitle');
    const subheading = element.querySelector('.promo-content h3, h3.div-heading, h3.SectionSubHeading');
    const description = element.querySelector('.promo-content p.body-details, .promo-content p.sectionBody');
    const linkList = element.querySelector('.promo-content ul');
    const ctaButtons = Array.from(element.querySelectorAll('.promo-content a.button, .promo-content a.button-font'))
      .filter(a => a.href && a.href.trim() !== '' && a.textContent.trim() !== '');

    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    if (description) textCell.push(description);
    if (linkList) textCell.push(linkList);
    if (ctaButtons.length > 0) textCell.push(...ctaButtons);

  } else if (isWellnessComponent) {
    // Pattern 3: Wellness component - h2 heading, p description, button CTA
    const heading = element.querySelector('h2.wellness-component-mainHeading');
    const description = element.querySelector('p.wellness-component-description');
    const ctaButton = element.querySelector('button.wellnessComponentAnchor.pill1');

    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (ctaButton) {
      // Convert button to a link element for proper import (buttons aren't linkable in EDS)
      const buttonText = ctaButton.textContent.trim();
      if (buttonText) {
        const link = document.createElement('a');
        link.href = ctaButton.getAttribute('href') || '#';
        link.textContent = buttonText;
        textCell.push(link);
      }
    }

  } else {
    // Pattern 2: Responsive grid two-col - multiple gs-container blocks with h3, ul, and button links
    const containers = element.querySelectorAll('.gs-container .container-content');
    containers.forEach((container) => {
      const heading = container.querySelector('h3');
      const list = container.querySelector('ul');
      const ctaLink = container.querySelector('a.button, a.button-font, a.button-font-healthy');

      if (heading) textCell.push(heading);
      if (list) textCell.push(list);
      if (ctaLink) textCell.push(ctaLink);
    });
  }

  // Build the image cell
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Build cells array: one row with two columns [image | text content]
  const cells = [
    [imageCell, textCell]
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
