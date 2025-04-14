/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find content inside fluid-engine blocks
  const findContent = (className) => {
    const block = element.querySelector(`.${className}`);
    return block ? block.querySelector('.sqs-block-content .sqs-html-content') : null;
  };

  // Extract title
  const titleBlock = findContent('fe-block-yui_3_17_2_1_1736804124924_6659');
  const title = titleBlock ? titleBlock.querySelector('h3') : null;

  // Extract description
  const descriptionBlock = findContent('fe-block-yui_3_17_2_1_1736804124924_19685');
  const description = descriptionBlock ? [...descriptionBlock.querySelectorAll('p')] : [];

  // Combine content into a single cell
  const combinedContent = [];
  if (title) combinedContent.push(title);
  combinedContent.push(...description);

  // Prepare table cells
  const headerRow = ['Hero'];
  const contentRow = [combinedContent];

  // Create table
  const cells = [
    headerRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}