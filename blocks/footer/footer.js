import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

function showFooter(footer, screenwidth) {
  const firstSection = footer.querySelectorAll(".section")[0];
  const secondSection = footer.querySelectorAll(".section")[1];

  const firstWrapper = firstSection?.querySelector(".default-content-wrapper");
  const secondWrapper = secondSection?.querySelector(".default-content-wrapper");

  if (!firstWrapper || !secondWrapper) return;

  const originalList = firstWrapper.querySelector("ul");

  if (!originalList) return;

  // Remove any previously inserted cloned list
  secondWrapper.querySelector(".merged-footer-ul")?.remove();
  firstWrapper.querySelector(".merged-footer-ul")?.remove();

  // Always show the original in mobile, hide in desktop
  if (screenwidth.matches) {
    originalList.style.display = "none";

    const clonedList = originalList.cloneNode(true);
    clonedList.classList.add("merged-footer-ul");
    clonedList.style.display = ""; // ensure visible

    secondWrapper.insertBefore(clonedList, secondWrapper.firstChild);
  } else {
    originalList.style.display = ""; 
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata("footer");
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : "/footer";
  const fragment = await loadFragment(footerPath);

  block.textContent = "";
  const footer = document.createElement("div");
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);

  const screenwidth = window.matchMedia("(min-width: 767px)");
  showFooter(footer, screenwidth);

  screenwidth.addEventListener("change", () => showFooter(footer, screenwidth));
  window.addEventListener("resize", () => showFooter(footer, screenwidth));
}
