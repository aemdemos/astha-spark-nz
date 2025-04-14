/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row with exactly one column and correct text
  const headerRow = ['Columns'];

  // Extract all blocks within the given element
  const contentBlocks = Array.from(element.querySelectorAll('.fe-block'));

  // Initialize table rows with the header
  const cells = [headerRow];

  // Create a row for content, distributing each distinct piece of content into its own column
  const contentRow = contentBlocks.map(block => {
    const blockContent = block.querySelector('.sqs-block-content');

    if (blockContent) {
      // Extract text content (e.g., headings or paragraphs)
      const textContent = blockContent.querySelector('h2, h3, p');
      if (textContent) {
        return textContent.cloneNode(true);
      }

      // Extract image content
      const imageContent = blockContent.querySelector('img');
      if (imageContent) {
        return imageContent.cloneNode(true);
      }
    }

    // Return an empty string for blocks without usable content
    return ''; // Empty column for missing content
  });

  // Add content row to the table, ensuring each distinct piece of content occupies its own column
  cells.push(contentRow);

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}