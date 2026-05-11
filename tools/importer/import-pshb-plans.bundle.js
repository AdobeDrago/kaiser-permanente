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

  // tools/importer/import-pshb-plans.js
  var import_pshb_plans_exports = {};
  __export(import_pshb_plans_exports, {
    default: () => import_pshb_plans_default
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

  // tools/importer/parsers/cards-plan.js
  function parse2(element, { document }) {
    const cells = [];
    const planColumns = element.querySelectorAll('.summary-container > [class*="summary-child"]');
    planColumns.forEach((column) => {
      const titleCard = column.querySelector('.summary-title-card .summary-card-heading, [class*="summary-card-heading"]');
      const descriptionCards = column.querySelectorAll('.summary-card .summarys-card-description, [class*="summarys-card-description"]');
      const contentCell = [];
      if (titleCard) {
        const heading = document.createElement("h3");
        heading.textContent = titleCard.textContent.trim();
        contentCell.push(heading);
      }
      descriptionCards.forEach((desc) => {
        const subHeading = desc.querySelector("h3");
        if (subHeading) {
          const h4 = document.createElement("h4");
          h4.textContent = subHeading.textContent.trim();
          contentCell.push(h4);
        }
        const bulletList = desc.querySelector("ul");
        if (bulletList) {
          contentCell.push(bulletList.cloneNode(true));
        }
      });
      if (contentCell.length > 0) {
        cells.push([contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-plan", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-benefits.js
  function parse3(element, { document }) {
    const cells = [];
    let tables = element.querySelectorAll("table.largeTableComponent, table.small-table");
    if (!tables.length) {
      const accordionComponent = element.closest(".accordion-component");
      const parentResponsiveGrid = accordionComponent ? accordionComponent.closest(".responsivegrid") : element.closest(".responsivegrid");
      if (parentResponsiveGrid) {
        const grandParent = parentResponsiveGrid.parentElement;
        if (grandParent) {
          const siblings = grandParent.querySelectorAll(":scope > .responsivegrid");
          const allTables = [];
          siblings.forEach((sib) => {
            const tableComp = sib.querySelector(".table-component");
            if (tableComp) {
              const found = tableComp.querySelectorAll("table.largeTableComponent, table.small-table");
              found.forEach((t) => allTables.push(t));
            }
          });
          if (allTables.length) {
            tables = allTables;
          }
        }
      }
    }
    const tableArray = Array.from(tables);
    const largeTables = tableArray.filter((t) => t.classList.contains("largeTableComponent"));
    const smallTables = tableArray.filter((t) => t.classList.contains("small-table"));
    if (largeTables.length > 0) {
      largeTables.forEach((table) => {
        const parentContainer = table.closest(".table-container, table.table-container");
        const caption = parentContainer ? parentContainer.querySelector("caption.table-header, caption") : null;
        if (caption && caption.textContent.trim()) {
          const captionEl = document.createElement("strong");
          captionEl.textContent = caption.textContent.trim();
          cells.push([[captionEl]]);
        }
        const headerRow = table.querySelector("thead tr, tr.largeTable-header-row");
        if (headerRow) {
          const headerCells = Array.from(headerRow.querySelectorAll("th, td")).map((th) => {
            const text = th.textContent.trim();
            if (!text) return "";
            const strong = document.createElement("strong");
            strong.textContent = text;
            return strong;
          });
          cells.push(headerCells);
        }
        const bodyRows = table.querySelectorAll("tbody tr");
        bodyRows.forEach((row) => {
          const rowCells = Array.from(row.querySelectorAll("td, th")).map((td) => td.textContent.trim());
          cells.push(rowCells);
        });
      });
    }
    if (smallTables.length > 0) {
      smallTables.forEach((table) => {
        const caption = table.querySelector("caption .table-header-small, caption");
        if (caption) {
          const captionEl = document.createElement("strong");
          captionEl.textContent = caption.textContent.trim();
          cells.push([[captionEl]]);
        }
        const allRows = table.querySelectorAll("tr.small-table-tr, tr");
        allRows.forEach((row) => {
          const ths = row.querySelectorAll("th.small-table-th, th");
          if (ths.length) {
            const headerCells = Array.from(ths).map((th) => {
              const strong = document.createElement("strong");
              strong.textContent = th.textContent.trim();
              return strong;
            });
            cells.push(headerCells);
          } else {
            const tds = row.querySelectorAll("td.small-table-td, td");
            if (tds.length) {
              const rowCells = Array.from(tds).map((td) => td.textContent.trim());
              cells.push(rowCells);
            }
          }
        });
      });
    }
    if (cells.length === 0) {
      const sectionHeading = element.querySelector("h2, .staticHeaderTitle");
      if (sectionHeading) {
        cells.push([[sectionHeading]]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-docs.js
  function parse4(element, { document }) {
    const cells = [];
    const expandDivs = element.querySelectorAll(".expandDiv");
    expandDivs.forEach((section) => {
      const titleButton = section.querySelector('button.titleRegion, [class*="titleRegion"]');
      const titleText = titleButton ? titleButton.textContent.trim() : "";
      if (!titleText) return;
      const contentPanel = section.querySelector(".contentExtended");
      if (!contentPanel) return;
      const contentCell = [];
      const planInfo = contentPanel.querySelector("p.planInfo");
      if (planInfo && planInfo.textContent.trim()) {
        const infoLink = planInfo.querySelector("a[href]");
        if (infoLink && infoLink.href) {
          contentCell.push(infoLink.cloneNode(true));
        } else if (planInfo.textContent.trim()) {
          const infoPara = document.createElement("p");
          infoPara.textContent = planInfo.textContent.trim();
          contentCell.push(infoPara);
        }
      }
      const planDesc = contentPanel.querySelector("p.planDescription");
      if (planDesc && planDesc.textContent.trim()) {
        const descPara = document.createElement("p");
        descPara.textContent = planDesc.textContent.trim();
        contentCell.push(descPara);
      }
      const docLinks = contentPanel.querySelectorAll('.subsectionDoc a.pdfPath[href], .subsectionDoc a[href*=".pdf"]');
      if (docLinks.length > 0) {
        const linkList = document.createElement("ul");
        docLinks.forEach((link) => {
          if (!link.href || !link.textContent.trim()) return;
          const li = document.createElement("li");
          const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-docs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-highlight.js
  function parse5(element, { document }) {
    const cells = [];
    let sourceEl = element;
    const hasHighlightCards = element.querySelectorAll(".highlight-card").length > 0;
    const hasFeatureCards = element.querySelectorAll(".feature-card-container").length > 0;
    if (!hasHighlightCards && !hasFeatureCards) {
      const parentGrid = element.closest(".aem-Grid");
      if (parentGrid) {
        const highlightsComp = parentGrid.querySelector(".highlights-component");
        if (highlightsComp) {
          sourceEl = highlightsComp;
        }
      }
      if (sourceEl === element) {
        const parentResponsive = element.closest(".responsivegrid");
        if (parentResponsive && parentResponsive.parentElement) {
          const highlightsComp = parentResponsive.parentElement.querySelector(".highlights-component");
          if (highlightsComp) {
            sourceEl = highlightsComp;
          }
        }
      }
    }
    const highlightCards = sourceEl.querySelectorAll(".highlight-card");
    const featureCards = sourceEl.querySelectorAll(".feature-card-container");
    if (highlightCards.length > 0) {
      highlightCards.forEach((card) => {
        const contentCell = [];
        const heading = card.querySelector('.highlight-card-heading, [class*="highlight-card-heading"]');
        const headingText = heading ? heading.textContent.trim() : "";
        if (headingText) {
          const titleEl = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = headingText;
          titleEl.appendChild(strong);
          contentCell.push(titleEl);
        }
        const description = card.querySelector('.highlights-card-description, [class*="highlights-card-description"]');
        const descText = description ? description.textContent.trim() : "";
        if (descText) {
          const descEl = document.createElement("p");
          descEl.textContent = descText;
          contentCell.push(descEl);
        }
        const ctaLink = card.querySelector('a.highlights-URL, a[class*="highlights-URL"]');
        if (ctaLink && ctaLink.href && ctaLink.textContent.trim()) {
          const link = document.createElement("a");
          link.href = ctaLink.href;
          link.textContent = ctaLink.textContent.trim().replace(/\s+/g, " ");
          const linkWrapper = document.createElement("p");
          linkWrapper.appendChild(link);
          contentCell.push(linkWrapper);
        }
        if (headingText || descText) {
          cells.push([contentCell]);
        }
      });
    } else if (featureCards.length > 0) {
      featureCards.forEach((card) => {
        const contentCell = [];
        const title = card.querySelector('.feature-card-title, [class*="feature-card-title"]');
        const titleText = title ? title.textContent.trim() : "";
        if (titleText) {
          const titleEl = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = titleText;
          titleEl.appendChild(strong);
          contentCell.push(titleEl);
        }
        const summary = card.querySelector('.feature-card-summary, [class*="feature-card-summary"]');
        const summaryText = summary ? summary.textContent.trim() : "";
        if (summaryText) {
          const summaryEl = document.createElement("p");
          summaryEl.textContent = summaryText;
          contentCell.push(summaryEl);
        }
        const ctaLink = card.querySelector('.CTA-link-container a, [class*="CTA"] a');
        if (ctaLink) {
          const link = ctaLink.cloneNode(true);
          const arrowImg = link.querySelector("img");
          if (arrowImg) arrowImg.remove();
          link.textContent = link.textContent.trim();
          const linkWrapper = document.createElement("p");
          linkWrapper.appendChild(link);
          contentCell.push(linkWrapper);
        }
        if (titleText || summaryText) {
          cells.push([contentCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-highlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/columns-contact.js
  function parse7(element, { document }) {
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

  // tools/importer/import-pshb-plans.js
  var parsers = {
    "hero-landing": parse,
    "cards-plan": parse2,
    "table-benefits": parse3,
    "accordion-docs": parse4,
    "cards-highlight": parse5,
    "columns-promo": parse6,
    "columns-contact": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "pshb-plans",
    description: "PSHB plans and benefits comparison pages with plan details, pricing, and enrollment CTAs",
    urls: [
      "https://choose.kaiserpermanente.org/pshb/plans",
      "https://choose.kaiserpermanente.org/pshb/retiree-plans"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: [".promo-v2-versionB-main-frame"]
      },
      {
        name: "cards-plan",
        instances: [".plans-summary"]
      },
      {
        name: "table-benefits",
        instances: [".accordion-default"]
      },
      {
        name: "accordion-docs",
        instances: [".accordion-retiree"]
      },
      {
        name: "cards-highlight",
        instances: [".card-pattern-component"]
      },
      {
        name: "columns-promo",
        instances: [".wellness-rewards"]
      },
      {
        name: "columns-contact",
        instances: [".plans-support-component"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_pshb_plans_default = {
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
  return __toCommonJS(import_pshb_plans_exports);
})();
