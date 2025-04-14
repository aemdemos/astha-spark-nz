/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row as per example
  const headerRow = ['Cards (no images)'];

  // Initialize rows for the table
  const rows = [];

  // Extract all blocks with content
  const blocks = element.querySelectorAll('.sqs-block-content');

  blocks.forEach((block) => {
    // Extract heading and description elements
    const heading = block.querySelector('h2, h3');
    const description = block.querySelector('p:not(:empty)');

    // Create content as an array to ensure proper hierarchical representation
    const content = [];
    if (heading) {
      const headingElement = document.createElement('strong');
      headingElement.textContent = heading.textContent.trim();
      content.push(headingElement);
    }
    if (description) {
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = description.textContent.trim();
      content.push(descriptionElement);
    }

    // Ensure rows have both heading and description, or just heading alone
    if (content.length > 0) {
      rows.push([content]);
    }
  });

  // Combine header row with extracted rows
  const tableData = [headerRow, ...rows];

  // Create the block table using WebImporter.DOMUtils.createTable()
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new structured table
  const hr = document.createElement('hr');
  element.replaceWith(hr, blockTable);
}