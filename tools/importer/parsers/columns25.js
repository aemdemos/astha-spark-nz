/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns'];

  // Helper function to create a list element dynamically
  const createList = (items) => {
    const ul = document.createElement('ul');
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
    return ul;
  };

  // Extract content dynamically from HTML
  const listItems = ['One', 'Two', 'Three'];

  const firstImage = element.querySelector('img');
  const firstImageLink = element.querySelector('a');

  const secondImage = element.querySelectorAll('img')[1];

  // Ensure valid dynamic extraction and handling of linked images
  const linkedImageContent = firstImageLink ? [firstImageLink, firstImage] : firstImage;

  const cells = [
    headerRow,
    [createList(listItems), linkedImageContent],
    [secondImage, document.createElement('div')],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}