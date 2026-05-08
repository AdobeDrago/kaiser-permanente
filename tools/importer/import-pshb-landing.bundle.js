/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-pshb-landing.js
  var import_pshb_landing_exports = {};
  __export(import_pshb_landing_exports, {
    default: () => import_pshb_landing_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const isPromoV2 = element.querySelector(".promo-v2-versionB-main-frame, .versionB-image") !== null;
    const isConcierge = element.querySelector(".concierge-main-div, .concierge-heading-txt") !== null;
    let bgImage = null;
    const contentCell = [];
    if (isPromoV2) {
      bgImage = element.querySelector("img.versionB-image, img#versionB-image");
      const heading = element.querySelector("h1.versionB-heading, h1.promo-header1, h1");
      const description = element.querySelector("div.versionB-description, .versionB-textContent-overlay div:not(.versionB-button-div)");
      const ctaLink = element.querySelector("a.versionB-button, .versionB-button-div a.button");
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);
    } else if (isConcierge) {
      bgImage = element.querySelector("img.image-concierge-reference");
      const heading = element.querySelector("h2.concierge-heading-txt");
      const description = element.querySelector("p.concierge-description-txt");
      const linkList = element.querySelector(".text-overlay ul");
      const ctaLink = element.querySelector("a.concierge-button");
      if (heading) contentCell.push(heading);
      if (description) {
        const descText = description.childNodes[0];
        if (descText && descText.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = descText.textContent.trim();
          contentCell.push(p);
        }
      }
      if (linkList) contentCell.push(linkList);
      if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);
    } else {
      bgImage = element.querySelector('img[class*="image"], img[class*="bg"], img');
      const heading = element.querySelector('h1, h2, [class*="heading"]');
      const description = element.querySelector('p, div[class*="description"]');
      const ctaLink = element.querySelector('a.button, a[class*="button"]');
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLink && ctaLink.textContent.trim()) contentCell.push(ctaLink);
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(
      '[class*="planSupport-column"], .planSupport-mainFrame > div'
    );
    const rowCells = [];
    columns.forEach((col) => {
      const heading = col.querySelector(
        'h3.planSupport-field-heading, h3[id^="planSupport-heading"], h3, h2'
      );
      const description = col.querySelector(
        'p.planSupport-field-description, p[id^="planSupport-description"], p'
      );
      const headingText = heading ? heading.textContent.trim() : "";
      const descText = description ? description.textContent.trim() : "";
      if (!headingText && !descText) return;
      const cellContent = [];
      if (heading && headingText) cellContent.push(heading);
      if (description && descText) cellContent.push(description);
      if (cellContent.length > 0) {
        rowCells.push(cellContent);
      }
    });
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const iframe = element.querySelector('iframe.video-iframe, iframe[class*="video"], iframe');
    const mediaCell = [];
    if (iframe) {
      const videoSrc = iframe.getAttribute("src");
      if (videoSrc) {
        const link = document.createElement("a");
        link.href = videoSrc;
        link.textContent = videoSrc;
        mediaCell.push(link);
      } else {
        mediaCell.push(iframe);
      }
    }
    const contentCell = [];
    const heading = element.querySelector("h2.video-header, h2, h3");
    if (heading) {
      const headingEl = document.createElement("h2");
      const boldText = heading.querySelector("b, strong");
      if (boldText) {
        headingEl.textContent = boldText.textContent.trim();
      } else {
        headingEl.textContent = heading.textContent.trim();
      }
      contentCell.push(headingEl);
    }
    const textContainer = element.querySelector(".video-text");
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll(":scope > p");
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (!text || text === "\xA0" || text === "\uFEFF") {
          return;
        }
        const link = p.querySelector("a[href]");
        if (link) {
          const href = link.getAttribute("href");
          if (href && href !== "#") {
            const linkText = link.textContent.trim().replace(/﻿/g, "");
            if (!linkText) {
              const title = link.getAttribute("title") || "";
              const linkEl = document.createElement("a");
              linkEl.href = href;
              linkEl.textContent = title || "View transcript";
              const linkP = document.createElement("p");
              linkP.appendChild(linkEl);
              contentCell.push(linkP);
            } else {
              contentCell.push(p);
            }
          }
        } else {
          contentCell.push(p);
        }
      });
    }
    const cells = [
      [mediaCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const isPromoComponent = element.querySelector(".main-frame-promo, .promo-content-div") !== null;
    const isWellnessComponent = element.querySelector(".wellness-main-div, .wellness-component-mainFrame") !== null;
    const image = element.querySelector(
      "img.promo-image, img.sectionImage, .gs-image-core img, .cmp-image__image, img.wellness-image, img#wellness-image"
    );
    const textCell = [];
    if (isPromoComponent) {
      const heading = element.querySelector(".promo-title-div h2, h2.promo-title, h2.sectionTitle");
      const subheading = element.querySelector(".promo-content h3, h3.div-heading, h3.SectionSubHeading");
      const description = element.querySelector(".promo-content p.body-details, .promo-content p.sectionBody");
      const linkList = element.querySelector(".promo-content ul");
      const ctaButtons = Array.from(element.querySelectorAll(".promo-content a.button, .promo-content a.button-font")).filter((a) => a.href && a.href.trim() !== "" && a.textContent.trim() !== "");
      if (heading) textCell.push(heading);
      if (subheading) textCell.push(subheading);
      if (description) textCell.push(description);
      if (linkList) textCell.push(linkList);
      if (ctaButtons.length > 0) textCell.push(...ctaButtons);
    } else if (isWellnessComponent) {
      const heading = element.querySelector("h2.wellness-component-mainHeading");
      const description = element.querySelector("p.wellness-component-description");
      const ctaButton = element.querySelector("button.wellnessComponentAnchor.pill1");
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (ctaButton) {
        const buttonText = ctaButton.textContent.trim();
        if (buttonText) {
          const link = document.createElement("a");
          link.href = ctaButton.getAttribute("href") || "#";
          link.textContent = buttonText;
          textCell.push(link);
        }
      }
    } else {
      const containers = element.querySelectorAll(".gs-container .container-content");
      containers.forEach((container) => {
        const heading = container.querySelector("h3");
        const list = container.querySelector("ul");
        const ctaLink = container.querySelector("a.button, a.button-font, a.button-font-healthy");
        if (heading) textCell.push(heading);
        if (list) textCell.push(list);
        if (ctaLink) textCell.push(ctaLink);
      });
    }
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const cells = [
      [imageCell, textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-feature.js
  function parse5(element, { document }) {
    const cells = [];
    const tabLinks = element.querySelectorAll(".tabs__list-item a.tabs__link");
    const tabPanels = element.querySelectorAll(".tabs__content > .tabs__panel");
    tabLinks.forEach((tabLink, index) => {
      const tabLabel = tabLink.getAttribute("title") || tabLink.textContent.trim();
      const panel = tabPanels[index];
      if (!panel) return;
      const contentElements = [];
      const textContainer = panel.querySelector(".cmp-text");
      if (textContainer) {
        const children = textContainer.children;
        for (let i = 0; i < children.length; i++) {
          contentElements.push(children[i]);
        }
      }
      const img = panel.querySelector(".cmp-image img");
      if (img) {
        contentElements.push(img);
      }
      cells.push([tabLabel, contentElements]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse6(element, { document }) {
    const heading = element.querySelector('h2.banner-component-mainHeading, h2[class*="mainHeading"]');
    const subHeading = element.querySelector('h3.banner-component-subHeading, h3[class*="subHeading"]');
    const description = element.querySelector('p.banner-component-discription, p[class*="discription"], p[class*="description"]');
    const iconDivs = element.querySelectorAll('.banner-component-iconDiv, [class*="iconDiv"]');
    const cells = [];
    const introCell = [];
    if (heading) introCell.push(heading);
    if (subHeading) introCell.push(subHeading);
    if (description) introCell.push(description);
    if (introCell.length > 0) {
      cells.push([introCell]);
    }
    iconDivs.forEach((iconDiv) => {
      const icon = iconDiv.querySelector('.banner-component-icon, img[class*="icon"]');
      const textContainer = iconDiv.querySelector('.banner-component-iconText, [class*="iconText"]');
      const labelEl = textContainer ? textContainer.querySelector("b") : null;
      const linkEl = textContainer ? textContainer.querySelector("a") : null;
      const leftCell = [];
      if (icon) leftCell.push(icon);
      const rightCell = [];
      if (labelEl) rightCell.push(labelEl);
      if (linkEl) rightCell.push(linkEl);
      if (leftCell.length > 0 || rightCell.length > 0) {
        cells.push([leftCell, rightCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse7(element, { document }) {
    const cardContainers = element.querySelectorAll(".feature-card-container");
    const cells = [];
    cardContainers.forEach((card) => {
      const image = card.querySelector('.feature-thumbnail-image img, .feature-card-image, img[id="feature-card-image"]');
      const title = card.querySelector('.feature-card-title, [class*="feature-card-title"]');
      const summary = card.querySelector('.feature-card-summary, [class*="feature-card-summary"]');
      const ctaLink = card.querySelector('.CTA-link-container a, [class*="CTA"] a');
      const contentCell = [];
      if (title) {
        const titleEl = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        titleEl.appendChild(strong);
        contentCell.push(titleEl);
      }
      if (summary) {
        const summaryEl = document.createElement("p");
        summaryEl.textContent = summary.textContent.trim();
        contentCell.push(summaryEl);
      }
      if (ctaLink) {
        const link = ctaLink.cloneNode(true);
        const arrowImg = link.querySelector("img");
        if (arrowImg) arrowImg.remove();
        link.textContent = link.textContent.trim();
        const linkWrapper = document.createElement("p");
        linkWrapper.appendChild(link);
        contentCell.push(linkWrapper);
      }
      const imageCell = image ? [image] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kaiserpermanente-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#createdchatdiv",
        "#embedded-messaging",
        ".embeddedMessagingSiteContextFrame",
        ".global-alert-component",
        ".zipcode-lookup"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".experience-fragment_header",
        ".experience-fragment_footer",
        ".print-only",
        ".chat-co-browse",
        "link",
        "iframe",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/kaiserpermanente-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;
        const sectionEl = element.querySelector(selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-pshb-landing.js
  var parsers = {
    "hero-landing": parse,
    "columns-contact": parse2,
    "columns-media": parse3,
    "columns-promo": parse4,
    "tabs-feature": parse5,
    "cards-icon": parse6,
    "cards-feature": parse7
  };
  var PAGE_TEMPLATE = {
    name: "pshb-landing",
    description: "Plan Shop and Buy landing page - starter site template for multi-site management",
    urls: [
      "https://choose.kaiserpermanente.org/pshb/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: ["#promo--435069566", ".concierge-component"]
      },
      {
        name: "columns-contact",
        instances: [".plans-support-component"]
      },
      {
        name: "columns-media",
        instances: [".video-component"]
      },
      {
        name: "tabs-feature",
        instances: [".tabbed-content.panelcontainer"]
      },
      {
        name: "columns-promo",
        instances: ["#promo-2016534242", ".responsivegrid.two-col.aem-GridColumn--default--12:has(.gs-image-core)", ".wellness-rewards"]
      },
      {
        name: "cards-icon",
        instances: [".banner-component"]
      },
      {
        name: "cards-feature",
        instances: [".card-pattern-component"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "#promo--435069566",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Plan Support",
        selector: ".container-content.pale-blue",
        style: "pale-blue",
        blocks: ["columns-contact"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Video",
        selector: ".video-component",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Why Kaiser Permanente - Tabs",
        selector: ".tabbed-content.panelcontainer",
        style: null,
        blocks: ["tabs-feature"],
        defaultContent: ["#text-d28e84b210"]
      },
      {
        id: "section-5",
        name: "Explore Health Topics",
        selector: "#promo-2016534242",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Care and Coverage",
        selector: ["#text-45604a82ca", ".responsivegrid.two-col.aem-GridColumn--default--12:has(.gs-image-core)"],
        style: null,
        blocks: ["columns-promo"],
        defaultContent: ["#text-45604a82ca"]
      },
      {
        id: "section-7",
        name: "Care for Growing Families",
        selector: ".concierge-component",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Get Informed Stay Connected",
        selector: ".wellness-rewards",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Experience Kaiser Permanente",
        selector: ".banner-component",
        style: "dark-blue",
        blocks: ["cards-icon"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Specialty Care Cards",
        selector: ".card-pattern-component",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["#feature-card-component-heading"]
      },
      {
        id: "section-11",
        name: "Footnotes",
        selector: ".footnotes-component",
        style: null,
        blocks: [],
        defaultContent: [".footnotes-component"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_pshb_landing_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_pshb_landing_exports);
})();
