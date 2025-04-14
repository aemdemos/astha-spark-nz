/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns'];

  // Extract content dynamically from the provided HTML
  const contentBlocks = element.querySelectorAll('.sqs-html-content');

  // Extract text content from each block
  const columnsData = Array.from(contentBlocks).map(block => {
    const content = [];
    const headers = block.querySelectorAll('h3');
    const paragraphs = block.querySelectorAll('p');

    headers.forEach(header => {
      content.push(header.textContent.trim());
    });

    paragraphs.forEach(paragraph => {
      content.push(paragraph.textContent.trim());
    });

    return content.length > 0 ? content : ['No Content'];
  });

  // Create rows for the table
  const cells = [
    headerRow,
    ...columnsData.map(column => [column])
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}