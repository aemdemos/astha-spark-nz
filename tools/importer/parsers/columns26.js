/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row
  const headerRow = ['Columns'];

  // Extract all blocks under .sqs-block-content and combine their content
  const blocks = Array.from(element.querySelectorAll('.sqs-block-content .sqs-html-content'));
  const combinedContent = blocks.map((block) => {
    const clonedBlock = block.cloneNode(true);
    clonedBlock.querySelectorAll('style').forEach(style => style.remove());
    clonedBlock.querySelectorAll('script').forEach(script => script.remove());
    return clonedBlock;
  });

  // Create table structure
  const rows = [
    headerRow, 
    [combinedContent] // Combine all extracted blocks into one cell
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}