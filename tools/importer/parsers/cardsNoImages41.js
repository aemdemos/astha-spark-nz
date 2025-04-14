/* global WebImporter */
export default function parse(element, { document }) {
  // Function to parse and replace HTML
  const cells = [];

  // Add header row
  const headerRow = ['Cards (no images)'];
  cells.push(headerRow);

  // Process blocks in the element
  const blocks = element.querySelectorAll('.fe-block');
  blocks.forEach(block => {
    const blockContent = block.querySelector('.sqs-block-content');
    if (blockContent) {
      const paragraphs = Array.from(blockContent.querySelectorAll('p'));
      const heading = blockContent.querySelector('h3');

      const content = [];

      // Add heading if available
      if (heading) {
        const headingEl = document.createElement('strong');
        headingEl.textContent = heading.textContent.trim();
        content.push(headingEl);
      }

      // Add paragraph texts
      paragraphs.forEach(paragraph => {
        content.push(paragraph);
      });

      // Push content to cells only if there's valid content
      if (content.length > 0) {
        cells.push([content]);
      }
    }
  });

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}