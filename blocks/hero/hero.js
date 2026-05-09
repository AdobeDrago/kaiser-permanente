export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const picture = cell.querySelector(':scope > picture');
  if (!picture) {
    block.classList.add('no-image');
  }

  const contentNodes = [...cell.children].filter((el) => el !== picture);
  if (contentNodes.length === 0) return;

  const card = document.createElement('div');
  card.className = 'hero-card';
  contentNodes.forEach((el) => card.append(el));
  cell.append(card);
}
