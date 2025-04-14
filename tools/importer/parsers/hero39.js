/* global WebImporter */
export default function parse(element, { document }) {
  // Extracting relevant data from the input element
  const imageElement = element.querySelector('img');
  const imageURL = imageElement?.src || '';

  const textContentElement = element.querySelector('.sqs-html-content');
  const heading = textContentElement?.querySelector('h2');
  const subheading = textContentElement?.querySelector('p:nth-of-type(2)');

  // Creating DOM elements for the new structured block
  const image = imageURL ? document.createElement('img') : null;
  if (image) {
    image.src = imageURL;
    image.alt = imageElement?.alt || '';
  }

  const title = heading ? document.createElement('h1') : null;
  if (title) {
    title.textContent = heading.textContent;
  }

  const description = subheading ? document.createElement('p') : null;
  if (description) {
    description.textContent = subheading.textContent;
  }

  const cells = [
    ['Hero'], // Header row
    [
      [image, title, description].filter(Boolean) // Content row
    ],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replacing the original element with the new block
  element.replaceWith(block);
}