/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kaiser Permanente PSHB sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Only runs in afterTransform. Processes sections in reverse order.
 * All selectors verified from migration-work/cleaned.html.
 *
 * Section selectors from page-templates.json / cleaned.html:
 *   section-1:  #promo--435069566 (line 589)
 *   section-2:  .container-content.pale-blue (line 613, note: class="container-content  pale-blue")
 *   section-3:  .video-component (line 648)
 *   section-4:  .tabbed-content.panelcontainer (line 692)
 *   section-5:  #promo-2016534242 (line 903)
 *   section-6:  #text-45604a82ca (line 946)
 *   section-7:  .concierge-component (line 1023)
 *   section-8:  .wellness-rewards (line 1044)
 *   section-9:  .banner-component (line 1077)
 *   section-10: .card-pattern-component (line 1133)
 *   section-11: .footnotes-component (line 1190)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;
      const sectionEl = element.querySelector(selector);

      if (!sectionEl) continue;

      // Add Section Metadata block for sections with a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the section element (at the end of the section)
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before non-first sections to create section breaks
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
