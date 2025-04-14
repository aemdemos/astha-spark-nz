/* global WebImporter */
export default function parse(element, { document }) {
    const headerRow = ['Embed'];

    // Extract video source URL dynamically
    const videoElement = element.querySelector('video');
    const videoSrc = videoElement ? videoElement.src : '';

    // Extract poster image URL dynamically
    const posterUrl = videoElement ? videoElement.getAttribute('data-poster') || videoElement.getAttribute('poster') : '';

    // Create poster image element if a URL exists
    const imageElement = posterUrl ? document.createElement('img') : null;
    if (imageElement) {
        imageElement.src = posterUrl;
    }

    // Handle cases where video source is missing
    const linkElement = videoSrc ? document.createElement('a') : null;
    if (linkElement) {
        linkElement.href = videoSrc;
        linkElement.textContent = videoSrc;
    }

    // Combine image and link in a content row cell
    const contentRow = [];
    if (imageElement) contentRow.push(imageElement);
    if (linkElement) contentRow.push(linkElement);

    const tableData = [
        headerRow,
        [contentRow]
    ];

    // Validate table structure
    if (tableData.length !== 2 || tableData[0].length !== 1 || tableData[1].length !== 1) {
        throw new Error('Invalid table structure');
    }

    // Create the block table dynamically
    const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

    // Replace the original element
    element.replaceWith(blockTable);
}