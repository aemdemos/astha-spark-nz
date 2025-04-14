/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image URL
  const imgElement = element.querySelector('img[data-image]');
  const imageUrl = imgElement ? imgElement.getAttribute('src') : '';

  // Extract text content: Case Study, Heading, Description
  const textContainer = element.querySelector('.sqs-block-content .sqs-html-content');
  const caseStudy = textContainer.querySelector('p')?.textContent.trim() || '';
  const heading = textContainer.querySelector('h2')?.textContent.trim() || '';
  const description = textContainer.querySelector('p:nth-of-type(2)')?.textContent.trim() || '';

  // Create formatted table using extracted data
  const headerRow = ['Hero'];
  const contentRow = [
    (() => {
      const wrapper = document.createElement('div');
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = heading;
        wrapper.appendChild(img);
      }
      if (heading) {
        const title = document.createElement('h1');
        title.textContent = heading;
        wrapper.appendChild(title);
      }
      if (description) {
        const subheading = document.createElement('p');
        subheading.textContent = description;
        wrapper.appendChild(subheading);
      }
      return wrapper;
    })()
  ];

  const tableData = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with the new block table
  element.replaceWith(blockTable);
}