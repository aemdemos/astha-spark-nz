/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image
  const image = element.querySelector('img');
  const imageElement = document.createElement('img');
  imageElement.src = image ? image.src : '';
  imageElement.alt = image ? image.alt : '';

  // Extract the title
  const title = element.querySelector('h1');
  const titleElement = document.createElement('h1');
  titleElement.innerHTML = title ? title.innerHTML : '';

  // Extract the paragraph
  const paragraph = element.querySelector('p');
  const paragraphElement = document.createElement('p');
  paragraphElement.innerHTML = paragraph ? paragraph.innerHTML : '';

  // Extract the button
  const button = element.querySelector('.sqs-block-button-element');
  const buttonElement = document.createElement('a');
  buttonElement.href = button ? button.href : '';
  buttonElement.textContent = button ? button.textContent : '';

  // Combine all content into a single cell in the second row
  const combinedContent = document.createElement('div');
  combinedContent.appendChild(imageElement);
  combinedContent.appendChild(titleElement);
  combinedContent.appendChild(paragraphElement);
  combinedContent.appendChild(buttonElement);

  // Create the table
  const cells = [
    ['Hero'],
    [combinedContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the table
  element.replaceWith(table);
}