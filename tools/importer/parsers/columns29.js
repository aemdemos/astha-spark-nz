/* global WebImporter */
export default function parse(element, { document }) {
  // Correcting the header row to match the example exactly
  const headerRow = ['Columns'];

  // Extract relevant content from the input element
  const contentBlocks = Array.from(element.querySelectorAll('.sqs-block-content'));

  // Map extracted content into table cells
  const cells = contentBlocks.map((blockContent) => {
    const paragraphs = Array.from(blockContent.querySelectorAll('p')).map(p => p.cloneNode(true));
    const headings = Array.from(blockContent.querySelectorAll('h3')).map(h => h.cloneNode(true));
    const allContent = [...headings, ...paragraphs];
    return allContent;
  });

  // Create an array representing the table rows
  const tableData = [
    headerRow,
    cells
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(blockTable);
}