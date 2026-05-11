export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-docs-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-docs-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-docs-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
