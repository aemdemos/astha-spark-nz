/* global WebImporter */
export default function parse(element, { document }) {
  const rows = [];

  // Add the header row, matching the example exactly
  rows.push(['Cards (no images)']);

  // Helper function to add content rows dynamically
  function addRow(heading, description) {
    const content = [];

    if (heading) {
      const headingElement = document.createElement('h3');
      headingElement.textContent = heading.trim();
      content.push(headingElement);
    }

    if (description) {
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = description.trim();
      content.push(paragraphElement);
    }

    rows.push([content]);
  }

  // Dynamically extract content
  const blocks = element.querySelectorAll('.sqs-html-content');
  blocks.forEach((block) => {
    const heading = block.querySelector('h3')?.textContent;
    const paragraphs = block.querySelectorAll('p');

    const descriptions = Array.from(paragraphs)
      .map((p) => p.textContent)
      .filter((text) => text?.trim()) // Handle empty or whitespace-only paragraphs
      .join(' ');

    if (heading || descriptions) {
      addRow(heading, descriptions);
    }
  });

  // Create the table using the extracted data
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);

  return table;
}