export default function decorate(block) {
  const imageRow = block.querySelector(':scope > div:first-child');
  if (!imageRow?.querySelector('picture')) {
    block.classList.add('no-image');
  }

  const contentCol = block.querySelector(':scope > div:last-child > div');
  if (contentCol) {
    contentCol.classList.add('hero-landing-card');
  }
}
