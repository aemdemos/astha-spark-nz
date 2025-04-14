/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (no images)'];

  // Extracting the content cards
  const cards = [];

  element.querySelectorAll('.fe-block').forEach((block) => {
    const heading = block.querySelector('h3');
    const paragraphs = block.querySelectorAll('p');

    if (heading || paragraphs.length > 0) {
      const cardContent = [];

      // Add heading if present
      if (heading) {
        const headingElement = document.createElement('strong');
        headingElement.textContent = heading.textContent.trim();
        cardContent.push(headingElement);
      }

      // Add paragraphs
      paragraphs.forEach((paragraph) => {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = paragraph.textContent.trim();
        cardContent.push(paragraphElement);
      });

      cards.push([cardContent]);
    }
  });

  // Create the block table
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}