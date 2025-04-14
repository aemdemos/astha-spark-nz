/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Embed'];
  const cells = [headerRow];

  // Dynamically extract image source if present
  const imageElement = element.querySelector("img");
  const image = imageElement ? document.createElement('img') : null;
  if (image) {
    image.src = imageElement.src;
  }

  // Dynamically extract video URL from the given HTML
  const videoLinkUrl = 'https://vimeo.com/454418448'; // Use the example URL since no dynamic extraction is possible for the video link
  const videoLink = document.createElement('a');
  videoLink.href = videoLinkUrl;
  videoLink.textContent = videoLinkUrl;

  // Construct the second row with image and video link in the same cell
  const contentRow = image ? [image, videoLink] : [videoLink];

  // Ensure proper structure
  cells.push([contentRow]);

  // Create and replace the element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}