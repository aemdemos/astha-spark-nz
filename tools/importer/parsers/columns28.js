/* global WebImporter */
export default function parse(element, { document }) {
  // Correct the header row to match the example exactly
  const headerRow = ['Columns'];

  // Extract the first block (Heading)
  const headingBlock = element.querySelector('.fe-block-yui_3_17_2_1_1738612302565_5398 .sqs-html-content h3');
  const heading = headingBlock ? headingBlock.cloneNode(true) : document.createTextNode('');

  // Extract the image block
  const imageBlock = element.querySelector('.fe-block-yui_3_17_2_1_1738612302565_7724 img');
  const image = imageBlock ? imageBlock.cloneNode(true) : document.createTextNode('');

  // Extract the description block
  const descriptionBlock = element.querySelector('.fe-block-yui_3_17_2_1_1738612302565_10926 .sqs-html-content');
  const description = descriptionBlock ? descriptionBlock.cloneNode(true) : document.createTextNode('');

  // Construct the table rows
  const rows = [
    headerRow,
    [heading, image],
    [description],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}