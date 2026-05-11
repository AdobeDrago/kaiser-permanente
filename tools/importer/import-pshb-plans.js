/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLandingParser from './parsers/hero-landing.js';
import cardsPlanParser from './parsers/cards-plan.js';
import tableBenefitsParser from './parsers/table-benefits.js';
import accordionDocsParser from './parsers/accordion-docs.js';
import cardsHighlightParser from './parsers/cards-highlight.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kaiserpermanente-cleanup.js';
import sectionsTransformer from './transformers/kaiserpermanente-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-landing': heroLandingParser,
  'cards-plan': cardsPlanParser,
  'table-benefits': tableBenefitsParser,
  'accordion-docs': accordionDocsParser,
  'cards-highlight': cardsHighlightParser,
  'columns-promo': columnsPromoParser,
  'columns-contact': columnsContactParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'pshb-plans',
  description: 'PSHB plans and benefits comparison pages with plan details, pricing, and enrollment CTAs',
  urls: [
    'https://choose.kaiserpermanente.org/pshb/plans',
    'https://choose.kaiserpermanente.org/pshb/retiree-plans',
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['.promo-v2-versionB-main-frame'],
    },
    {
      name: 'cards-plan',
      instances: ['.plans-summary'],
    },
    {
      name: 'table-benefits',
      instances: ['.accordion-default'],
    },
    {
      name: 'accordion-docs',
      instances: ['.accordion-retiree'],
    },
    {
      name: 'cards-highlight',
      instances: ['.card-pattern-component'],
    },
    {
      name: 'columns-promo',
      instances: ['.wellness-rewards'],
    },
    {
      name: 'columns-contact',
      instances: ['.plans-support-component'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
