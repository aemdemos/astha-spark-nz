/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image URL from the section
  const image = element.querySelector('img');
  const imageUrl = image ? image.src : '';

  // Create the image element
  const imageElement = imageUrl ? (() => {
    const img = document.createElement('img');
    img.src = imageUrl;
    return img;
  })() : null;

  // Extract the title
  const titleElement = element.querySelector('h1');
  const title = titleElement ? titleElement.innerHTML : '';

  // Create the title element
  const titleNode = title ? (() => {
    const titleEl = document.createElement('h1');
    titleEl.innerHTML = title;
    return titleEl;
  })() : null;

  // Extract the subheading
  const subheadingElement = element.querySelector('p');
  const subheading = subheadingElement ? subheadingElement.innerHTML : '';

  // Create the subheading element
  const subheadingNode = subheading ? (() => {
    const subheadingEl = document.createElement('p');
    subheadingEl.innerHTML = subheading;
    return subheadingEl;
  })() : null;

  // Extract the Call-to-Action link and text
  const ctaElement = element.querySelector('a');
  const ctaText = ctaElement ? ctaElement.textContent.trim() : '';
  const ctaLink = ctaElement ? ctaElement.href : '';

  // Create CTA block
  const ctaBlock = document.createElement('div');
  if (ctaText && ctaLink) {
    const linkElement = document.createElement('a');
    linkElement.href = ctaLink;
    linkElement.textContent = ctaText;
    ctaBlock.appendChild(linkElement);
  }

  // Combine all elements into a single cell for the second row
  const combinedContent = document.createElement('div');
  if (imageElement) combinedContent.appendChild(imageElement);
  if (titleNode) combinedContent.appendChild(titleNode);
  if (subheadingNode) combinedContent.appendChild(subheadingNode);
  if (ctaBlock.childNodes.length > 0) combinedContent.appendChild(ctaBlock);

  // Create the table structure
  const cells = [
    ['Hero'], // Header row
    [combinedContent], // Single cell with all content merged
  ];

  // Generate the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}