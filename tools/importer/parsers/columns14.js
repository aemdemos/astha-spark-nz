/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row exactly as specified in the example
  const tableData = [['Columns']];

  // Gather all content blocks from the element
  const contentBlocks = Array.from(element.querySelectorAll('.sqs-block-content'));

  // Extract and organize content from each block
  contentBlocks.forEach(block => {
    const header = block.querySelector('h3')?.textContent.trim();
    const paragraphElements = Array.from(block.querySelectorAll('p'));
    const paragraphs = paragraphElements.map(p => p.cloneNode(true));

    // Add header row if header exists
    if (header) {
      tableData.push([header]);
    }

    // Add paragraph content as a single-row cell (only one column per row)
    if (paragraphs.length > 0) {
      const paragraphContainer = document.createElement('div');
      paragraphs.forEach(paragraph => paragraphContainer.appendChild(paragraph));
      tableData.push([paragraphContainer]);
    }
  });

  // Create the block table using WebImporter.DOMUtils.createTable()
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table (no return value)
  element.replaceWith(blockTable);
}