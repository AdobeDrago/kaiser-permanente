/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media variant.
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/pshb/
 * Generated: 2026-05-08
 *
 * Extracts a two-column layout: video/media on the left, heading + text on the right.
 * Source structure: .video-component-container > .video-section (iframe) + .content-section (heading, text, link)
 */
export default function parse(element, { document }) {
  // --- Column 1: Video/Media ---
  const iframe = element.querySelector('iframe.video-iframe, iframe[class*="video"], iframe');
  const mediaCell = [];

  if (iframe) {
    // Create a link to the video source so it can be authored as an embed
    const videoSrc = iframe.getAttribute('src');
    if (videoSrc) {
      const link = document.createElement('a');
      link.href = videoSrc;
      link.textContent = videoSrc;
      mediaCell.push(link);
    } else {
      mediaCell.push(iframe);
    }
  }

  // --- Column 2: Text Content ---
  const contentCell = [];

  // Heading - inside h2.video-header or similar
  const heading = element.querySelector('h2.video-header, h2, h3');
  if (heading) {
    // Create a clean heading element from the nested content
    const headingEl = document.createElement('h2');
    const boldText = heading.querySelector('b, strong');
    if (boldText) {
      headingEl.textContent = boldText.textContent.trim();
    } else {
      headingEl.textContent = heading.textContent.trim();
    }
    contentCell.push(headingEl);
  }

  // Description text - specifically from .video-text container
  const textContainer = element.querySelector('.video-text');
  if (textContainer) {
    const paragraphs = textContainer.querySelectorAll(':scope > p');
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      // Skip empty paragraphs, non-breaking space only, and invisible characters
      if (!text || text === ' ' || text === '﻿') {
        return;
      }
      // Check if paragraph contains a meaningful link (e.g., transcript)
      const link = p.querySelector('a[href]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          // Create a proper link with descriptive text if the link text is empty/invisible
          const linkText = link.textContent.trim().replace(/﻿/g, '');
          if (!linkText) {
            // Use title attribute or derive text from the href
            const title = link.getAttribute('title') || '';
            const linkEl = document.createElement('a');
            linkEl.href = href;
            linkEl.textContent = title || 'View transcript';
            const linkP = document.createElement('p');
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

  // Build cells: single row with two columns [media | text content]
  const cells = [
    [mediaCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
