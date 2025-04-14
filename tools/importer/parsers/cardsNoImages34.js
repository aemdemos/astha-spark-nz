/* global WebImporter */
export default function parse(element, { document }) {
  const cardsHeader = ['Cards (no images)'];

  const rows = [cardsHeader];

  const contentBlocks = element.querySelectorAll('.fe-block');

  contentBlocks.forEach((block) => {
    const blockContent = block.querySelector('.sqs-block-content');

    if (blockContent) {
      const heading = blockContent.querySelector('h3');
      const paragraphs = blockContent.querySelectorAll('p');

      let rowContent = [];

      if (heading) {
        rowContent.push(heading.cloneNode(true));
      }

      if (paragraphs.length > 0) {
        paragraphs.forEach((paragraph) => {
          rowContent.push(paragraph.cloneNode(true));
        });
      }

      if (rowContent.length > 0) {
        rows.push([rowContent]);
      }
    }

    const imageBlock = block.querySelector('img');
    if (imageBlock) {
      const imgElement = document.createElement('img');
      imgElement.src = imageBlock.src;
      rows.push([imgElement]);
    }
  });

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(blockTable);
}