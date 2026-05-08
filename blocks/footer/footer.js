import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function getSitePrefix() {
  const { pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 1 ? `/${segments[0]}` : '';
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const prefix = getSitePrefix();
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${prefix}/footer`;
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
