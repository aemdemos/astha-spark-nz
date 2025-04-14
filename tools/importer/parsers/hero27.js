/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the block name
  const blockName = 'Hero';

  // Extract the image URL
  const imageElement = element.querySelector('img');
  const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
  const image = document.createElement('img');
  image.src = imageUrl;

  // Extract the heading and subheading
  const headingElement = element.querySelector('h2');
  const subheadingElement = element.querySelector('p');

  const heading = headingElement ? headingElement.textContent.trim() : '';
  const subheading = subheadingElement ? subheadingElement.textContent.trim() : '';

  const headingNode = document.createElement('h1');
  headingNode.textContent = heading;

  const subheadingNode = document.createElement('p');
  subheadingNode.textContent = subheading;

  // Correct the table structure: combine image, heading, subheading into a single cell
  const contentCell = document.createElement('div');
  contentCell.append(image, headingNode, subheadingNode);

  // Correct the table header row to match the example exactly
  const headerRow = [blockName];

  // Construct table rows
  const cells = [
    headerRow,
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the constructed table
  element.replaceWith(table);
}