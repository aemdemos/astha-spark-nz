/* global WebImporter */
export default function parse(element, { document }) {
    const headerRow = ['Cards'];
    const rows = [];

    const cardElements = [...element.querySelectorAll('.fe-block')];

    cardElements.forEach((cardElement) => {
        const imageElement = cardElement.querySelector('img');
        const titleElement = cardElement.querySelector('h3');
        const descriptionElement = cardElement.querySelector('p');

        const image = imageElement ? document.createElement('img') : null;
        if (imageElement) {
            image.src = imageElement.src;
            image.alt = imageElement.alt || '';
        }

        const content = [];
        if (titleElement) {
            const title = document.createElement('b');
            title.textContent = titleElement.textContent.trim();
            content.push(title);
        }

        if (descriptionElement) {
            const description = document.createElement('p');
            description.textContent = descriptionElement.textContent.trim();
            content.push(description);
        }

        if (image && content.length) {
            rows.push([image, content]);
        }
    });

    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

    element.replaceWith(table);
}