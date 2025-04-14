/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the navigation links dynamically
  const navLinks = Array.from(element.querySelectorAll('.header-nav-item a')).map((navLink) => {
    const link = document.createElement('a');
    link.href = navLink.href;
    link.textContent = navLink.textContent.trim();
    return link;
  });

  // Ensure navigation links are distinct and properly separated
  const uniqueNavLinks = [...new Map(navLinks.map(link => [link.href, link])).values()];

  // Extract the logo dynamically
  const logoImg = element.querySelector('.header-title-logo img');
  let logo = null;
  if (logoImg) {
    logo = document.createElement('img');
    logo.src = logoImg.src;
    logo.alt = logoImg.alt;
  }

  // Extract the action button dynamically
  const actionLinkElement = element.querySelector('.header-actions-action a');
  let actionLink = null;
  if (actionLinkElement) {
    actionLink = document.createElement('a');
    actionLink.href = actionLinkElement.href;
    actionLink.textContent = actionLinkElement.textContent.trim();
  }

  // Create the table rows dynamically
  const headerRow = ['Columns'];
  const secondRow = [logo, ...uniqueNavLinks];
  const thirdRow = [actionLink];

  const tableRows = [headerRow, secondRow, thirdRow];

  // Generate the table block
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the element with the new table
  element.replaceWith(blockTable);
}