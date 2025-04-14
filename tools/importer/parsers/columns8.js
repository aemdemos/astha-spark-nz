/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns'];

  // Extracting image
  const imageWrapper = element.querySelector('.sqs-block-image img');
  const image = imageWrapper ? imageWrapper.cloneNode(true) : document.createTextNode('');

  // Extracting address
  const addressWrapper = element.querySelector('.fe-block-yui_3_17_2_1_1729204014804_41853 .sqs-html-content');
  const address = addressWrapper ? addressWrapper.cloneNode(true) : document.createTextNode('');

  // Extracting contact
  const contactWrapper = element.querySelector('.fe-block-72ee43d4247f8c7b590c .sqs-html-content');
  const contact = contactWrapper ? contactWrapper.cloneNode(true) : document.createTextNode('');

  // Extracting privacy
  const privacyWrapper = element.querySelector('.fe-block-yui_3_17_2_1_1729204014804_48333 .sqs-html-content');
  const privacy = privacyWrapper ? privacyWrapper.cloneNode(true) : document.createTextNode('');

  // Extracting copyright
  const copyrightWrapper = element.querySelector('.fe-block-yui_3_17_2_1_1729204014804_43823 .sqs-html-content');
  const copyright = copyrightWrapper ? copyrightWrapper.cloneNode(true) : document.createTextNode('');

  // Build the table rows
  const rows = [
    headerRow,
    [image],
    [address],
    [contact],
    [privacy],
    [copyright],
  ];

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element
  element.replaceWith(block);
}