/* global WebImporter */
export default function parse(element, { document }) {
  // Correcting header row to match example exactly
  const headerRow = ['Hero'];

  // Extract the title content
  const titleElement = element.querySelector('h1');
  const title = document.createElement('h1');
  title.textContent = titleElement ? titleElement.textContent.trim() : '';

  // Extract the subtitle content
  const subtitleElement = element.querySelector('p');
  const subtitle = document.createElement('p');
  subtitle.textContent = subtitleElement ? subtitleElement.textContent.trim() : '';

  // Extract the background image
  const backgroundImageElement = element.querySelector('img');
  const backgroundImage = document.createElement('img');
  backgroundImage.src = backgroundImageElement ? backgroundImageElement.src : '';

  // Combine all elements into a single cell in the second row
  const secondRowContent = document.createElement('div');
  if (backgroundImage.src) {
    secondRowContent.appendChild(backgroundImage);
  }
  secondRowContent.appendChild(title);
  secondRowContent.appendChild(subtitle);

  // Create table cells
  const cells = [
    headerRow,
    [secondRowContent],
  ];

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}