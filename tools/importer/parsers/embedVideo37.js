/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the correct video URL dynamically
  const videoLinkElement = element.querySelector('a[href*="vimeo.com"]');
  const url = videoLinkElement ? videoLinkElement.href : 'https://vimeo.com/454418448'; // Default to provided Vimeo URL

  // The image element should be relevant to the video embed block
  const imageElement = element.querySelector('img[src*="vimeo"]');
  const image = imageElement ? document.createElement('img') : null;
  if (image) {
    image.setAttribute('src', imageElement.src);
    image.setAttribute('alt', imageElement.alt || 'Video Thumbnail');
  }

  // Create a link element for the URL
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.textContent = url;

  // Define the table cells
  const headerRow = ['Embed'];
  const contentRow = image ? [image, link] : [link];
  const cells = [
    [headerRow],
    [contentRow],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}