/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-benefits variant.
 * Base block: table
 * Source: https://choose.kaiserpermanente.org/pshb/plans
 * Selector: .accordion-default
 * Generated: 2026-05-11
 *
 * Structure: Extracts rate comparison tables that are structurally associated
 * with the accordion-default component. On the live page, the accordion-default
 * only contains a heading; the actual rate/benefits tables live in sibling
 * .table-component containers within the same parent grid structure.
 *
 * The parser traverses up from .accordion-default to the nearest .responsivegrid,
 * then looks at sibling .responsivegrid containers for .table-component elements
 * containing the rate and benefits comparison tables.
 *
 * Source table types:
 * 1. Rate tables (table.small-table): per-plan rates with caption, th headers, td data
 * 2. Benefits tables (table.largeTableComponent): multi-plan comparison grouped
 *    by category (Outpatient, Maternity, Hospital, Emergency, Rx, OOP max)
 *
 * Output: A table block containing all benefit/rate rows with headers.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Strategy: find tables within the element first
  let tables = element.querySelectorAll('table.largeTableComponent, table.small-table');

  // If no tables inside the element, traverse to sibling .table-component containers
  if (!tables.length) {
    const accordionComponent = element.closest('.accordion-component');
    const parentResponsiveGrid = accordionComponent
      ? accordionComponent.closest('.responsivegrid')
      : element.closest('.responsivegrid');

    if (parentResponsiveGrid) {
      const grandParent = parentResponsiveGrid.parentElement;
      if (grandParent) {
        // Look at all sibling responsivegrid containers for table-components
        const siblings = grandParent.querySelectorAll(':scope > .responsivegrid');
        const allTables = [];
        siblings.forEach((sib) => {
          const tableComp = sib.querySelector('.table-component');
          if (tableComp) {
            const found = tableComp.querySelectorAll('table.largeTableComponent, table.small-table');
            found.forEach((t) => allTables.push(t));
          }
        });
        if (allTables.length) {
          tables = allTables;
        }
      }
    }
  }

  // Convert NodeList or array to a proper array for filtering
  const tableArray = Array.from(tables);
  const largeTables = tableArray.filter((t) => t.classList.contains('largeTableComponent'));
  const smallTables = tableArray.filter((t) => t.classList.contains('small-table'));

  if (largeTables.length > 0) {
    // Process large comparison tables (Benefits Summary format)
    largeTables.forEach((table) => {
      // Get category caption from parent .table-container
      const parentContainer = table.closest('.table-container, table.table-container');
      const caption = parentContainer
        ? parentContainer.querySelector('caption.table-header, caption')
        : null;

      // Add category header row if caption exists
      if (caption && caption.textContent.trim()) {
        const captionEl = document.createElement('strong');
        captionEl.textContent = caption.textContent.trim();
        cells.push([[captionEl]]);
      }

      // Extract header row
      const headerRow = table.querySelector('thead tr, tr.largeTable-header-row');
      if (headerRow) {
        const headerCells = Array.from(headerRow.querySelectorAll('th, td')).map((th) => {
          const text = th.textContent.trim();
          if (!text) return '';
          const strong = document.createElement('strong');
          strong.textContent = text;
          return strong;
        });
        cells.push(headerCells);
      }

      // Extract data rows
      const bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach((row) => {
        const rowCells = Array.from(row.querySelectorAll('td, th')).map((td) => td.textContent.trim());
        cells.push(rowCells);
      });
    });
  }

  if (smallTables.length > 0) {
    // Process small rate tables (Plan Rates format)
    smallTables.forEach((table) => {
      // Get plan name from caption
      const caption = table.querySelector('caption .table-header-small, caption');
      if (caption) {
        const captionEl = document.createElement('strong');
        captionEl.textContent = caption.textContent.trim();
        cells.push([[captionEl]]);
      }

      // Extract all rows
      const allRows = table.querySelectorAll('tr.small-table-tr, tr');
      allRows.forEach((row) => {
        const ths = row.querySelectorAll('th.small-table-th, th');
        if (ths.length) {
          // Header row
          const headerCells = Array.from(ths).map((th) => {
            const strong = document.createElement('strong');
            strong.textContent = th.textContent.trim();
            return strong;
          });
          cells.push(headerCells);
        } else {
          // Data row
          const tds = row.querySelectorAll('td.small-table-td, td');
          if (tds.length) {
            const rowCells = Array.from(tds).map((td) => td.textContent.trim());
            cells.push(rowCells);
          }
        }
      });
    });
  }

  // Fallback: if no tables found, extract heading as a placeholder
  if (cells.length === 0) {
    const sectionHeading = element.querySelector('h2, .staticHeaderTitle');
    if (sectionHeading) {
      cells.push([[sectionHeading]]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-benefits', cells });
  element.replaceWith(block);
}
