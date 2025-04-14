/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  // Add header row with exactly one column containing the text 'Columns'
  const headerRow = ['Columns'];
  cells.push(headerRow);

  // Extract content blocks
  const contentBlocks = element.querySelectorAll('.fe-block');

  contentBlocks.forEach((block) => {
    const cellContent = document.createElement('div');

    const imageBlock = block.querySelector('.sqs-block-image img');
    const textBlock = block.querySelector('.sqs-html-content');

    // Add image to cell content
    if (imageBlock) {
      const imgElement = document.createElement('img');
      imgElement.src = imageBlock.src;
      imgElement.alt = imageBlock.alt;
      cellContent.appendChild(imgElement);
    }

    // Add text content to cell content
    if (textBlock) {
      const textElement = document.createElement('div');
      textElement.innerHTML = textBlock.innerHTML;
      cellContent.appendChild(textElement);
    }

    // Push each block's combined content as a row with one column
    cells.push([cellContent]);
  });

  // Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}