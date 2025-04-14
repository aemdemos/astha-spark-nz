/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image
  const backgroundImg = element.querySelector('img');
  const backgroundImage = backgroundImg ? document.createElement('img') : null;
  if (backgroundImage) {
    backgroundImage.src = backgroundImg.getAttribute('src');
    backgroundImage.alt = backgroundImg.getAttribute('alt') || '';
  }

  // Extract the title
  const titleElement = element.querySelector('h1');
  const title = titleElement ? document.createElement('h1') : null;
  if (title) {
    title.textContent = titleElement.textContent.trim();
  }

  // Extract the subheading
  const subheadingElement = element.querySelector('p');
  const subheading = subheadingElement ? document.createElement('p') : null;
  if (subheading) {
    subheading.textContent = subheadingElement.textContent.trim();
  }

  // Extract the call-to-action button
  const buttonElement = element.querySelector('.sqs-block-button-element');
  const button = buttonElement ? document.createElement('a') : null;
  if (button) {
    button.href = buttonElement.getAttribute('href');
    button.textContent = buttonElement.textContent.trim();
  }

  // Create table rows
  const headerRow = ['Hero'];
  const contentRow = [
    backgroundImage,
    title,
    subheading,
    button
  ].filter(Boolean).map(item => [item]); // Each element as a separate row in a single column

  const cells = [headerRow, ...contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}