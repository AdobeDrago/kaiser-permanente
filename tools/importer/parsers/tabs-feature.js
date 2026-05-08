/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-feature
 * Base block: tabs
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Structure: 2 columns - row 1 = block name, subsequent rows = tab label | tab content
 * Generated: 2026-05-08
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab labels from navigation
  const tabLinks = element.querySelectorAll('.tabs__list-item a.tabs__link');
  // Extract tab panels
  const tabPanels = element.querySelectorAll('.tabs__content > .tabs__panel');

  // Build one row per tab: [tab label, tab content]
  tabLinks.forEach((tabLink, index) => {
    // Get the tab label text (exclude the icon span content)
    const tabLabel = tabLink.getAttribute('title') || tabLink.textContent.trim();

    // Get corresponding panel content
    const panel = tabPanels[index];
    if (!panel) return;

    // Build content cell from panel
    const contentElements = [];

    // Extract text content (headings, paragraphs, links, quotes)
    const textContainer = panel.querySelector('.cmp-text');
    if (textContainer) {
      // Get all direct children of cmp-text for content
      const children = textContainer.children;
      for (let i = 0; i < children.length; i++) {
        contentElements.push(children[i]);
      }
    }

    // Extract image
    const img = panel.querySelector('.cmp-image img');
    if (img) {
      contentElements.push(img);
    }

    // Build row: [tab label text, content elements]
    cells.push([tabLabel, contentElements]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-feature', cells });
  element.replaceWith(block);
}
