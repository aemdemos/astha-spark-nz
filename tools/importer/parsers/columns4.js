/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row
  const headerRow = ['Columns'];

  // Prepare content columns
  const contentColumns = [];

  const blocks = element.querySelectorAll('.fe-block');

  blocks.forEach((block) => {
    const blockContent = block.querySelector('.sqs-block-content');
    if (!blockContent) {
      return;
    }

    let columnContent = [];

    // Check if the block contains an image
    const image = blockContent.querySelector('img');
    if (image) {
      const imageElement = document.createElement('img');
      imageElement.src = image.src;
      imageElement.alt = image.alt || '';
      columnContent.push(imageElement);
    }

    // Check if the block contains text content
    const paragraphs = blockContent.querySelectorAll('p, h2, h3');
    if (paragraphs.length > 0) {
      paragraphs.forEach((p) => {
        const strong = p.querySelector('strong');
        columnContent.push(strong ? strong : p);
      });
    }

    if (columnContent.length > 0) {
      contentColumns.push(columnContent);
    }
  });

  // Create the table structure
  const tableCells = [
    headerRow,
    contentColumns // Each column is now properly grouped
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}