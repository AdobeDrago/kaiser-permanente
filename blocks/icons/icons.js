import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const isList = block.classList.contains('list');
  const ul = document.createElement('ul');
  ul.className = 'icons-items';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'icons-item';

    const [imageCol, textCol] = [...row.children];

    // Icon wrapper
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icons-icon';

    // Picture may be inside an h3 or directly in the div
    const picture = imageCol.querySelector('picture');
    if (picture) iconWrapper.append(picture);

    // Text wrapper
    const textWrapper = document.createElement('div');
    textWrapper.className = 'icons-text';

    if (isList) {
      // In list variant, look for a heading or strong as the title
      const heading = textCol.querySelector('h1,h2,h3,h4,h5,h6,strong');
      if (heading) {
        const titleEl = document.createElement('p');
        titleEl.className = 'icons-title';
        titleEl.textContent = heading.textContent;
        // Remove the heading from textCol so it doesn't duplicate
        const headingParent = heading.closest('p') || heading;
        headingParent.remove();
        textWrapper.append(titleEl);
      }
    }

    [...textCol.childNodes].forEach((node) => textWrapper.append(node.cloneNode(true)));

    li.append(iconWrapper, textWrapper);
    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
