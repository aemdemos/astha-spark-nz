/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];

  // First row: header with block name
  const headerRow = ['Cards (no images)'];
  cells.push(headerRow);

  // Extract content from the HTML element
  const cards = element.querySelectorAll('.fe-block');

  cards.forEach((card) => {
    const contentWrapper = card.querySelector('.sqs-block-content');
    if (contentWrapper) {
      const paragraphs = contentWrapper.querySelectorAll('p');

      // Combine heading and description into one cell
      const cellContent = [];
      paragraphs.forEach((p) => {
        const textContent = p.textContent.trim();
        if (textContent) {
          const paragraphElement = document.createElement('p');
          paragraphElement.textContent = textContent;
          cellContent.push(paragraphElement);
        }
      });

      if (cellContent.length > 0) {
        cells.push([cellContent]);
      }
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}