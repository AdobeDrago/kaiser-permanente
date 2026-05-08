/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLandingParser from './parsers/hero-landing.js';
import columnsContactParser from './parsers/columns-contact.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsPromoParser from './parsers/columns-promo.js';
import tabsFeatureParser from './parsers/tabs-feature.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kaiserpermanente-cleanup.js';
import sectionsTransformer from './transformers/kaiserpermanente-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-landing': heroLandingParser,
  'columns-contact': columnsContactParser,
  'columns-media': columnsMediaParser,
  'columns-promo': columnsPromoParser,
  'tabs-feature': tabsFeatureParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'pshb-landing',
  description: 'Plan Shop and Buy landing page - starter site template for multi-site management',
  urls: [
    'https://choose.kaiserpermanente.org/pshb/'
  ],
  blocks: [
    {
      name: 'hero-landing',
      instances: ['#promo--435069566', '.concierge-component']
    },
    {
      name: 'columns-contact',
      instances: ['.plans-support-component']
    },
    {
      name: 'columns-media',
      instances: ['.video-component']
    },
    {
      name: 'tabs-feature',
      instances: ['.tabbed-content.panelcontainer']
    },
    {
      name: 'columns-promo',
      instances: ['#promo-2016534242', '.responsivegrid.two-col.aem-GridColumn--default--12:has(.gs-image-core)', '.wellness-rewards']
    },
    {
      name: 'cards-icon',
      instances: ['.banner-component']
    },
    {
      name: 'cards-feature',
      instances: ['.card-pattern-component']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '#promo--435069566',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Plan Support',
      selector: '.container-content.pale-blue',
      style: 'pale-blue',
      blocks: ['columns-contact'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Video',
      selector: '.video-component',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Why Kaiser Permanente - Tabs',
      selector: '.tabbed-content.panelcontainer',
      style: null,
      blocks: ['tabs-feature'],
      defaultContent: ['#text-d28e84b210']
    },
    {
      id: 'section-5',
      name: 'Explore Health Topics',
      selector: '#promo-2016534242',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Care and Coverage',
      selector: ['#text-45604a82ca', '.responsivegrid.two-col.aem-GridColumn--default--12:has(.gs-image-core)'],
      style: null,
      blocks: ['columns-promo'],
      defaultContent: ['#text-45604a82ca']
    },
    {
      id: 'section-7',
      name: 'Care for Growing Families',
      selector: '.concierge-component',
      style: null,
      blocks: ['hero-landing'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Get Informed Stay Connected',
      selector: '.wellness-rewards',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'Experience Kaiser Permanente',
      selector: '.banner-component',
      style: 'dark-blue',
      blocks: ['cards-icon'],
      defaultContent: []
    },
    {
      id: 'section-10',
      name: 'Specialty Care Cards',
      selector: '.card-pattern-component',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['#feature-card-component-heading']
    },
    {
      id: 'section-11',
      name: 'Footnotes',
      selector: '.footnotes-component',
      style: null,
      blocks: [],
      defaultContent: ['.footnotes-component']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
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

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
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
