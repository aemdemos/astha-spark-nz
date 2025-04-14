/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as per the example
  const headerRow = ['Hero'];

  // Extract content
  const imageSrc = element.querySelector('img')?.getAttribute('src');
  const headingText = element.querySelector('h2')?.textContent?.trim();
  const subheadingText = element.querySelector('p.sqsrte-small:nth-of-type(2)')?.textContent?.trim();
  const firstParagraphText = element.querySelector('p.sqsrte-small:nth-of-type(1)')?.textContent?.trim();

  // Handle missing data (fallback to empty strings if necessary)
  const headingElement = document.createElement('h1');
  headingElement.textContent = headingText || '';

  const subheadingElement = document.createElement('p');
  subheadingElement.textContent = subheadingText || '';

  const firstParagraphElement = document.createElement('p');
  firstParagraphElement.textContent = firstParagraphText || '';

  const imageElement = document.createElement('img');
  if (imageSrc) {
    imageElement.setAttribute('src', imageSrc);
  }

  // Wrap all content in a single cell
  const contentWrapper = document.createElement('div');
  contentWrapper.append(imageElement, headingElement, subheadingElement, firstParagraphElement);

  // Create table
  const cells = [
    headerRow,
    [contentWrapper],
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}