/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards'];

  const cardsData = element.querySelectorAll('.user-items-list-carousel__slide');
  const cardsRows = Array.from(cardsData).map((card) => {
    const image = card.querySelector('img');
    const imageElement = document.createElement('img');
    imageElement.src = image.getAttribute('data-src');
    imageElement.alt = image.getAttribute('alt');

    const title = card.querySelector('.list-item-content__title');
    const description = card.querySelector('.list-item-content__description');
    const button = card.querySelector('.list-item-content__button a');

    const content = [];
    if (title) {
      const titleElement = document.createElement('strong');
      titleElement.textContent = title.textContent.trim();
      content.push(titleElement);
    }

    if (description) {
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = description.textContent.trim();
      content.push(descriptionElement);
    }

    if (button) {
      const buttonElement = document.createElement('a');
      buttonElement.href = button.href;
      buttonElement.textContent = button.textContent.trim();
      content.push(buttonElement);
    }

    return [imageElement, content];
  });

  const tableData = [headerRow, ...cardsRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}