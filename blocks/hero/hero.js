export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Support both single-row (picture + content in same cell) and
  // two-row (row 1 = picture, row 2 = content) document structures.
  let picture = null;
  let contentCell = null;

  if (rows.length >= 2) {
    picture = rows[0].querySelector('picture');
    contentCell = rows[1].querySelector(':scope > div');
  } else if (rows.length === 1) {
    const cell = rows[0].querySelector(':scope > div');
    picture = cell?.querySelector('picture');
    contentCell = cell;
  }

  if (!picture) {
    block.classList.add('no-image');
  }

  // Rebuild block as a single row containing picture + card
  const inner = document.createElement('div');
  const outer = document.createElement('div');

  if (picture) {
    inner.append(picture);
  }

  if (contentCell) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    [...contentCell.children].forEach((el) => {
      if (el !== picture) card.append(el);
    });
    inner.append(card);
  }

  outer.append(inner);
  block.innerHTML = '';
  block.append(outer);
}
