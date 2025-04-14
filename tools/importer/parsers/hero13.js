/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to create the table
  const headerRow = ['Hero'];

  // Extract content
  const quote = element.querySelector('.sqs-html-content h4');
  const attribution = element.querySelector('.sqs-html-content p');

  // Combine all content into a single cell for the second row
  const combinedContent = document.createElement('div');
  if (quote) combinedContent.appendChild(quote.cloneNode(true));
  if (attribution) combinedContent.appendChild(attribution.cloneNode(true));

  const contentRow = [combinedContent];

  // Create a block table
  const block = WebImporter.DOMUtils.createTable(
    [headerRow, contentRow],
    document
  );

  // Replace the original element with the block
  element.replaceWith(block);
}