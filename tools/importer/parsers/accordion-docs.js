/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-docs variant.
 * Base block: accordion
 * Source: https://choose.kaiserpermanente.org/pshb/plans
 * Selector: .accordion-retiree
 * Generated: 2026-05-11
 *
 * Structure: Each row = one accordion section with 2 cells:
 *   Cell 1: section title (from button.titleRegion)
 *   Cell 2: section content (description text + PDF download links)
 *
 * Source DOM structure:
 *   .accordion-retiree
 *     h2.accordionHeaderTitle (overall heading - may be extracted as default content)
 *     .expandDiv (repeated per accordion section)
 *       .region-title-container
 *         button.titleRegion (section title, e.g. "View 2026 Plan Documents")
 *       .contentExtended (panel content)
 *         p.planInfo (optional intro text or link)
 *         p.planDescription (optional description text)
 *         .subsectionDoc (document links container)
 *           a.pdfPath (repeated PDF download links)
 *
 * Note: The h2.accordionHeaderTitle and h4 disclaimer text are section-level
 * default content and not included in the accordion block rows.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all expandable sections
  const expandDivs = element.querySelectorAll('.expandDiv');

  expandDivs.forEach((section) => {
    // Cell 1: Section title from button
    const titleButton = section.querySelector('button.titleRegion, [class*="titleRegion"]');
    const titleText = titleButton ? titleButton.textContent.trim() : '';

    if (!titleText) return; // Skip sections without a title

    // Cell 2: Section content (description + links)
    const contentPanel = section.querySelector('.contentExtended');
    if (!contentPanel) return;

    const contentCell = [];

    // Extract intro text/link (p.planInfo may contain a link)
    const planInfo = contentPanel.querySelector('p.planInfo');
    if (planInfo && planInfo.textContent.trim()) {
      const infoLink = planInfo.querySelector('a[href]');
      if (infoLink && infoLink.href) {
        contentCell.push(infoLink.cloneNode(true));
      } else if (planInfo.textContent.trim()) {
        const infoPara = document.createElement('p');
        infoPara.textContent = planInfo.textContent.trim();
        contentCell.push(infoPara);
      }
    }

    // Extract description text (p.planDescription)
    const planDesc = contentPanel.querySelector('p.planDescription');
    if (planDesc && planDesc.textContent.trim()) {
      const descPara = document.createElement('p');
      descPara.textContent = planDesc.textContent.trim();
      contentCell.push(descPara);
    }

    // Extract PDF document links from .subsectionDoc
    const docLinks = contentPanel.querySelectorAll('.subsectionDoc a.pdfPath[href], .subsectionDoc a[href*=".pdf"]');
    if (docLinks.length > 0) {
      const linkList = document.createElement('ul');
      docLinks.forEach((link) => {
        if (!link.href || !link.textContent.trim()) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        li.appendChild(a);
        linkList.appendChild(li);
      });
      if (linkList.children.length > 0) {
        contentCell.push(linkList);
      }
    }

    if (contentCell.length > 0) {
      cells.push([titleText, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-docs', cells });
  element.replaceWith(block);
}
