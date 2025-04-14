/* global WebImporter */
export default function parse(element, { document }) {
  const contentBlocks = [];

  // Extract relevant content from the HTML blocks
  const blocks = element.querySelectorAll('.fluid-engine .fe-block');

  blocks.forEach((block) => {
    const content = block.querySelector('h3, p');
    if (content) {
      contentBlocks.push(content.cloneNode(true));
    }
  });

  // Combine all extracted content into a single cell for the table
  const combinedContent = document.createElement('div');
  contentBlocks.forEach((block) => combinedContent.appendChild(block));

  // Correctly structure the header row and content row
  const headerRow = ['Columns'];
  const contentRow = [combinedContent];

  const tableData = [headerRow, contentRow];

  // Create the table using WebImporter.DOMUtils.createTable
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}