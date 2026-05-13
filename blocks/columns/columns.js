export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      // Group consecutive button-container paragraphs into a flex-wrap div
      const buttonGroups = [];
      let currentGroup = [];
      [...col.children].forEach((child) => {
        if (child.classList.contains('button-container')) {
          currentGroup.push(child);
        } else {
          if (currentGroup.length > 1) buttonGroups.push([...currentGroup]);
          currentGroup = [];
        }
      });
      if (currentGroup.length > 1) buttonGroups.push([...currentGroup]);

      buttonGroups.forEach((group) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'columns-buttons-wrap';
        group[0].before(wrapper);
        group.forEach((btn) => wrapper.append(btn));
      });
    });
  });
}
