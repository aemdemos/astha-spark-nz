/* global WebImporter */
export default function parse(element, { document }) {
  // Validate the header row matches the exact example
  const headerRow = ['Hero'];

  // Extract the background image URL
  const imgElement = element.querySelector('img');
  const imgSrc = imgElement ? imgElement.src : null;
  const image = imgSrc ? document.createElement('img') : null;
  if (image) {
    image.src = imgSrc;
  }

  // Extract the title from the original HTML
  const titleElement = element.querySelector('h2');
  const title = titleElement ? titleElement.textContent : '';
  const titleHeading = document.createElement('h1');
  titleHeading.textContent = title;

  // Extract the subheading
  const subheadingElement = element.querySelector('p.sqsrte-small:nth-of-type(2)');
  const subheading = subheadingElement ? subheadingElement.textContent : '';
  const subheadingParagraph = document.createElement('p');
  subheadingParagraph.textContent = subheading;

  // Create the table structure matching the example and ensure content inclusion
  const cells = [
    headerRow,
    [
      [
        image,
        document.createElement('hr'),
        titleHeading,
        subheadingParagraph
      ]
    ]
  ];

  // Create the block table using WebImporter.DOMUtils.createTable
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new structured block
  element.replaceWith(block);
}