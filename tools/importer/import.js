// Helper function to strip HTML tags and decode entities
const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const createMetadataBlock = (main, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta['jcr:title'] = stripHtml(title.innerHTML).replace(/[\n\t]/gm, '');
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta['jcr:description'] = desc.content;
  }

  // find the <meta property="og:image"> element
  const img = document.querySelector('[property="og:image"]');
  if (img) {
    // create an <img> element
    const el = document.createElement('img');

    el.src = img.content;
    meta.Image = el;
  }

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};

const createSectionMetadata = (style, metadata) => {
  const cells = [
    ['Section Metadata'],
  ];

  if (style && style.length > 0) {
    const styleDiv = document.createElement('div');
    styleDiv.textContent = 'style';
    const valueDiv = document.createElement('div');
    let value = '';
    for (let i = 0; i < style.length; i += 1) {
      value += style[i];
      if (i !== style.length - 1) {
        value += ', ';
      }
    }
    valueDiv.textContent = value;
    const styleRow = [styleDiv, valueDiv];
    cells.push(styleRow);
  }

  if (metadata) {
    Object.keys(metadata).forEach((key) => {
      const keyDiv = document.createElement('div');
      keyDiv.textContent = key;

      const valueDiv = document.createElement('div');
      valueDiv.textContent = metadata[key];

      const row = [keyDiv, valueDiv];
      cells.push(row);
    });
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  return block;
};

const createHero = (image, title, description, linkText, linkUrl) => {
  const cells = [
    ['Hero'], // First row with heading
  ];

  // Add each field on a new line
  // const fields = [];

  // Add image and alt
  if (image) {
    let src = image.src;
    const filename = src.substring(src.lastIndexOf('/') + 1);
    if (!filename.includes('.')) {
      src += '.png';
    }
    image.src = src;
    // fields.push(image);
    cells.push([image]);
  }

  // Add title
  if (title) {
    const splitText = title.innerHTML.split(/<br\s*\/?>/i);
    const headingEl = document.createElement('span');
    headingEl.innerHTML = splitText[0];
    cells.push([headingEl]);

    if (splitText.length > 1) {
       const span = document.createElement('span');
       span.innerHTML = splitText[1];
       cells.push([span]);
    }
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = stripHtml(description.innerHTML);
    // fields.push(p);
    cells.push([p]);
  }

  // Create table using WebImporter.DOMUtils
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createCards = (cards) => {
  const cells = [
    ['Cards'], // First row with heading
  ];

  // Process each card
  cards.forEach(({ image, title, description }) => {
    // Create image cell
    const imageCell = document.createElement('div');
    if (image) {
      const img = document.createElement('img');
      // Convert PNG filenames with both _ and + to use only underscores
      let imgSrc = image.src;
      if (imgSrc.toLowerCase().endsWith('.png') && imgSrc.includes('_') && imgSrc.includes('+')) {
        const lastSlashIndex = imgSrc.lastIndexOf('/');
        const filename = imgSrc.substring(lastSlashIndex + 1);
        const convertedFilename = filename.replace(/[_+]/g, '_');
        imgSrc = imgSrc.substring(0, lastSlashIndex + 1) + convertedFilename;
      }
      img.src = imgSrc;
      img.alt = image.alt || '';
      imageCell.appendChild(img);
    }

    // Create content cell for title and description
    const contentCell = document.createElement('div');
    const fields = [];

    // Add title
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = stripHtml(title.innerHTML);
      fields.push(h3);
    }

    // Add description
    if (description) {
      const p = document.createElement('p');
      p.textContent = stripHtml(description.innerHTML);
      fields.push(p);
    }

    // Join fields with line breaks
    fields.forEach((field, index) => {
      contentCell.appendChild(field);
      if (index < fields.length - 1) {
        contentCell.appendChild(document.createElement('br'));
      }
    });

    // Add both cells to the row
    cells.push([imageCell, contentCell]);
  });

  return WebImporter.DOMUtils.createTable(cells, document);
};

// const adjustLinks = (element) => {
//   const link = element.querySelector('a');
//   if (link && link.href.endsWith('/')) {
//     link.href = link.href.slice(0, -1);
//   }
// };

const createVideoBlock = (videoPlayer) => {
  if (!videoPlayer) {
    return null;
  }

  // Get video config from the sqs-native-video element
  const videoContainer = videoPlayer.closest('.sqs-native-video');
  if (!videoContainer) {
    return null;
  }

  const videoConfig = videoContainer.getAttribute('data-config-video');
  if (!videoConfig) {
    return null;
  }

  let videoData;
  try {
    videoData = JSON.parse(videoConfig);
  } catch (e) {
    return null;
  }

  // Get the video URL from alexandriaUrl in structuredContent
  const videoUrl = videoData.structuredContent?.alexandriaUrl?.replace('{variant}', '1920:1080');
  if (!videoUrl) {
    return null;
  }

  // Get poster URL from the plyr__poster background-image
  const posterElement = videoPlayer.querySelector('.plyr__poster');

  const posterStyle = posterElement ? posterElement.getAttribute('style') : null;

  const posterUrl = posterStyle ? posterStyle.match(/url\("([^"]+)"\)/)?.[1] : null;

  if (!posterUrl) {
    return null;
  }

  const cells = [
    ['Video'], // First row with heading
  ];

  // Create content cell
  const contentCell = document.createElement('div');

  // Add each field on a new line
  const fields = [];

  // Add video URL as a link
  const videoLink = document.createElement('a');
  videoLink.href = videoUrl;
  videoLink.textContent = 'Video URL';
  fields.push(videoLink);

  // Add poster image
  const posterImage = document.createElement('img');
  posterImage.src = posterUrl;
  posterImage.alt = videoData.filename || 'Video thumbnail';
  fields.push(posterImage);

  // Join fields with line breaks
  fields.forEach((field, index) => {
    contentCell.appendChild(field);
    if (index < fields.length - 1) {
      contentCell.appendChild(document.createElement('br'));
    }
  });

  // Add the content cell to cells array
  cells.push([contentCell]);

  const block = WebImporter.DOMUtils.createTable(cells, document);

  return block;
};

const parseDefaultContent = (main, document) => {
  const hero = main.querySelector('.fluid-engine');
  let insertAfterElement = null;

  if (hero) {
    const heroImage = hero.querySelector('img');
    const heroTitle = hero.querySelector('.sqs-block-content h1');
    const heroDescription = hero.querySelector('.sqs-block-content p');
    const heroLink = hero.querySelector('.sqs-block-button-element--medium');

    if (heroImage && heroTitle && heroDescription && heroLink) {
      const heroLinkText = heroLink.textContent.trim();
      const heroLinkUrl = heroLink.getAttribute('href');
      const heroBlock = createHero(heroImage, heroTitle, heroDescription, heroLinkText, heroLinkUrl);
      main.prepend(heroBlock);

      const divider = document.createElement('hr');
      heroBlock.after(divider);
      insertAfterElement = divider;

      hero.remove();
    }
  }

  let allSections = main.querySelectorAll('.fluid-engine');
  const sectionWithVideo = allSections[0];

  if (sectionWithVideo) {
    const sectionTitle = sectionWithVideo.querySelector('.sqs-block-content h2');
    const sectionContent = sectionWithVideo.querySelector('.sqs-block-content p');

    if (sectionTitle) {
      if (insertAfterElement) {
        insertAfterElement.after(sectionTitle);
        insertAfterElement = sectionTitle;
      } else {
        main.prepend(sectionTitle);
        insertAfterElement = sectionTitle;
      }
    }

    if (sectionContent) {
      if (insertAfterElement) {
        insertAfterElement.after(sectionContent);
        insertAfterElement = sectionContent;
      } else {
        main.prepend(sectionContent);
        insertAfterElement = sectionContent;
      }
    }

    const videoPlayer = sectionWithVideo.querySelector('.native-video-player');
    if (videoPlayer) {
      const videoContainer = videoPlayer.closest('.sqs-native-video');
      if (videoContainer) {
        const videoConfig = videoContainer.getAttribute('data-config-video');
        if (videoConfig) {
          try {
            const videoData = JSON.parse(videoConfig);
            const videoUrl = videoData.structuredContent?.alexandriaUrl?.replace('{variant}', '1920:1080');
            if (videoUrl) {
              const posterElement = videoPlayer.querySelector('.plyr__poster');
              const posterStyle = posterElement ? posterElement.getAttribute('style') : null;
              const posterUrl = posterStyle ? posterStyle.match(/url\("([^"]+)"\)/)?.[1] : null;

              if (posterUrl) {
                const videoBlock = createVideoBlock(videoPlayer);
                if (videoBlock) {
                  if (insertAfterElement) {
                    insertAfterElement.after(videoBlock);
                    insertAfterElement = videoBlock;

                    const sectionMetadataBlock = createSectionMetadata(['grey-background'], {});
                    videoBlock.after(sectionMetadataBlock);
                    insertAfterElement = sectionMetadataBlock;

                    const divider = document.createElement('hr');
                    sectionMetadataBlock.after(divider);
                    insertAfterElement = divider;
                  } else {
                    main.prepend(videoBlock);
                    insertAfterElement = videoBlock;
                  }
                }
              }
            }
          } catch (e) {}
        }
      }
    }

    sectionWithVideo.remove();

    allSections = main.querySelectorAll('.fluid-engine');

    if (allSections.length > 0) {
      const nextSection = allSections[0];
      const sectionTitle = nextSection.querySelector('.sqs-block-content h2');

      if (sectionTitle) {
        if (insertAfterElement) {
          insertAfterElement.after(sectionTitle);
          insertAfterElement = sectionTitle;
        } else {
          main.prepend(sectionTitle);
          insertAfterElement = sectionTitle;
        }
      }

      const images = nextSection.querySelectorAll('img');
      const titles = nextSection.querySelectorAll('h3');
      const descriptions = nextSection.querySelectorAll('p');

      const numCards = Math.min(images.length, titles.length, descriptions.length);

      const cards = [];
      for (let i = 0; i < numCards; i++) {
        cards.push({
          image: images[i],
          title: titles[i],
          description: descriptions[i]
        });
      }

      if (cards.length > 0) {
        const cardsBlock = createCards(cards);
        if (insertAfterElement) {
          insertAfterElement.after(cardsBlock);
          insertAfterElement = cardsBlock;

          const ctaButton = nextSection.querySelector('.sqs-block-button-element--medium');
          if (ctaButton) {
            insertAfterElement.after(ctaButton);
            insertAfterElement = ctaButton;
          }
        } else {
          main.prepend(cardsBlock);
          insertAfterElement = cardsBlock;

          const ctaButton = nextSection.querySelector('.sqs-block-button-element--medium');
          if (ctaButton) {
            insertAfterElement.after(ctaButton);
            insertAfterElement = ctaButton;
          }
        }
      }

      nextSection.remove();
    }
  }
};

/* global WebImporter */
export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    document, url, html, params,
  }) => {
    const main = document.body;

    WebImporter.DOMUtils.remove(main, [
      'footer',
      'header',
      '.floating-cart'
    ]);

    parseDefaultContent(main, document);
    createMetadataBlock(main, document);
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),

};
