/* global WebImporter */
export default function parse(element, { document }) {
  const cells = [];

  // Header row indicating the type of the block
  cells.push(['Columns']);

  // Extracting blocks from the provided HTML
  const blocks = element.querySelectorAll('.sqs-block-content .sqs-html-content');

  if (blocks.length > 0) {
    const row = [];

    blocks.forEach((block) => {
      const contentElements = [];

      // Extract heading
      const heading = block.querySelector('h2');
      if (heading) {
        const headingElement = document.createElement('p');
        headingElement.textContent = heading.textContent;
        contentElements.push(headingElement);
      }

      // Extract subheading
      const subheading = block.querySelector('h4');
      if (subheading) {
        const subheadingElement = document.createElement('p');
        subheadingElement.textContent = subheading.textContent;
        contentElements.push(subheadingElement);
      }

      // Extract paragraph
      const paragraph = block.querySelector('p');
      if (paragraph) {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = paragraph.textContent;
        contentElements.push(paragraphElement);
      }

      row.push(contentElements);
    });

    cells.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}