/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns'];

  // Extracting features text
  const features = element.querySelector('.fe-block-yui_3_17_2_1_1729811633582_35964 .sqs-html-content h2');
  const featuresText = features ? features.textContent.trim() : '';

  // Extracting description text
  const description1 = element.querySelector('.fe-block-yui_3_17_2_1_1729811633582_39801 .sqs-html-content p');
  const descriptionText1 = description1 ? description1.textContent.trim() : '';

  const description2 = element.querySelector('.fe-block-3becba909013f3671dc9 .sqs-html-content p');
  const descriptionText2 = description2 ? description2.textContent.trim() : '';

  // Extracting images
  const image1 = element.querySelector('.fe-block-yui_3_17_2_1_1729811633582_37467 img');
  const imageEl1 = image1 ? document.createElement('img') : null;
  if (imageEl1) {
    imageEl1.src = image1.src;
    imageEl1.alt = image1.alt;
  }

  const image2 = element.querySelector('.fe-block-9e8c7515ff691fef8c7a img');
  const imageEl2 = image2 ? document.createElement('img') : null;
  if (imageEl2) {
    imageEl2.src = image2.src;
    imageEl2.alt = image2.alt;
  }

  // Assembling the table structure
  const cells = [
    headerRow,
    [featuresText, imageEl1],
    [descriptionText1, imageEl2],
    [descriptionText2],
  ];

  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Replacing the original element
  element.replaceWith(tableBlock);
}