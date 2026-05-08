/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kaiser Permanente PSHB cleanup.
 * Removes non-authorable site chrome, widgets, and utility elements.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent banner (line 1833: <div id="onetrust-consent-sdk">)
    // Chat widget proactive messages (line 2077: <div id="createdchatdiv">)
    // Salesforce embedded messaging (line 2141: <div id="embedded-messaging">)
    // Embedded messaging iframe (line 2139: <iframe class="embeddedMessagingSiteContextFrame">)
    // Global alert banner - expired (line 537: <div class="global-alert-component">)
    // ZIP code lookup utility (line 551: <div class="zipcode-lookup">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#createdchatdiv',
      '#embedded-messaging',
      '.embeddedMessagingSiteContextFrame',
      '.global-alert-component',
      '.zipcode-lookup',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header experience fragment (line 5: <div class="experience-fragment_header experiencefragment">)
    // Footer experience fragment (line 1216: <div class="experience-fragment_footer experiencefragment">)
    // Print-only logo (line 2: <div class="print-only">)
    // Chat/co-browse widget (line 1205: <div class="chat-co-browse">)
    // CSS link elements (scattered throughout)
    // Iframes (e.g., onetrust text-resize iframe)
    // Noscript elements
    WebImporter.DOMUtils.remove(element, [
      '.experience-fragment_header',
      '.experience-fragment_footer',
      '.print-only',
      '.chat-co-browse',
      'link',
      'iframe',
      'noscript',
    ]);
  }
}
