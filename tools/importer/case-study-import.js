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

const createHero = (image, miniTitle, title, description) => {
  const cells = [
    ['Hero'], // First row with heading
  ];

  // Create content cell
  const contentCell = document.createElement('div');

  // Add each field on a new line
  const fields = [];

  // Add image and alt
  if (image) {
    // Create a new img element with the same attributes
    const img = document.createElement('img');
    let imgSrc = image.src;
    // Add .png extension if the URL doesn't have a file extension
    if (!imgSrc.match(/\.[a-zA-Z0-9]+$/)) {
      imgSrc += '.png';
    }
    img.src = imgSrc;
    img.alt = image.alt || '';
    fields.push(img);
  }

  // Add mini title
  if (miniTitle) {
    const p = document.createElement('p');
    p.textContent = stripHtml(miniTitle.innerHTML);
    fields.push(p);
  }

  // Add title
  if (title) {
    // Create new h1 element to preserve heading
    const h1 = document.createElement('h1');
    const titleContent = title.innerHTML;
    
    // Split content at <br> tag
    const parts = titleContent.split(/<br\s*\/?>/i);
    if (parts.length > 1) {
      // Join parts with carriage return and newline
      const text = stripHtml(parts[0]).trim() + '\r\n' + stripHtml(parts[1]).trim();
      h1.textContent = text;
    } else {
      h1.textContent = stripHtml(titleContent);
    }
    fields.push(h1);
  }

  // Add description
  if (description) {
    // Create new p element to preserve paragraph
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

  // Add the content cell to cells array
  cells.push([contentCell]);

  // Create table using WebImporter.DOMUtils
  return WebImporter.DOMUtils.createTable(cells, document);
};

const createColumns = (titles, contentArrays) => {
  const cells = [
    ['Columns'], // Block type
  ];

  // Helper to process content blocks
  const processContentBlocks = (blocks) => {
    const contentCol = document.createElement('div');
    blocks.forEach((block) => {
      // Skip blocks that contain the title
      if (block.querySelector('h3')) return;
      
      // Get all paragraphs
      const paragraphs = block.querySelectorAll('p');
      paragraphs.forEach((para, index) => {
        const p = document.createElement('p');
        p.textContent = stripHtml(para.innerHTML);
        contentCol.appendChild(p);
        if (index < paragraphs.length - 1) {
          contentCol.appendChild(document.createElement('br'));
        }
      });
    });
    return contentCol;
  };

  // Create first row
  if (titles[0] && contentArrays[0]) {
    // First column - title
    const titleCol = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = stripHtml(titles[0].innerHTML);
    titleCol.appendChild(h3);
    
    // Second column - content
    const contentCol = processContentBlocks(contentArrays[0]);
    
    cells.push([titleCol, contentCol]);
  }

  // Create second row
  if (titles[1] && contentArrays[1]) {
    // First column - title
    const titleCol = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = stripHtml(titles[1].innerHTML);
    titleCol.appendChild(h3);
    
    // Second column - content
    const contentCol = processContentBlocks(contentArrays[1]);
    
    cells.push([titleCol, contentCol]);
  }

  return WebImporter.DOMUtils.createTable(cells, document);
};

const createQuote = (quoteContent, quoteAttribution) => {
  const cells = [
    ['Quote'], // Block type
  ];

  // Add quotation from h4 in first row
  if (quoteContent) {
    const quoteCell = document.createElement('div');
    quoteCell.textContent = stripHtml(quoteContent.innerHTML);
    cells.push([quoteCell]);
  }

  // Add attribution from p in second row
  if (quoteAttribution) {
    const attributionCell = document.createElement('div');
    attributionCell.textContent = stripHtml(quoteAttribution.innerHTML);
    cells.push([attributionCell]);
  }

  return WebImporter.DOMUtils.createTable(cells, document);
};

const createColumnsWithAllParagraphs = (title, paragraphs) => {
  const cells = [
    ['Columns'], // Block type
  ];

  // Create first column with title
  const column1 = document.createElement('div');
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = stripHtml(title.innerHTML);
    column1.appendChild(h3);
  }

  // Create second column with all paragraphs
  const column2 = document.createElement('div');
  if (paragraphs && paragraphs.length > 0) {
    paragraphs.forEach((paragraph, index) => {
      const p = document.createElement('p');
      
      // Create a temporary div to handle HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = paragraph.innerHTML;
      
      // Find all strong tags
      const strongTags = tempDiv.querySelectorAll('strong');
      if (strongTags.length > 0) {
        // If there are strong tags, add br after them
        strongTags.forEach(strong => {
          if (!strong.nextSibling || strong.nextSibling.nodeName !== 'BR') {
            const br = document.createElement('br');
            if (strong.nextSibling) {
              strong.parentNode.insertBefore(br, strong.nextSibling);
            } else {
              strong.parentNode.appendChild(br);
            }
          }
        });
      }
      
      // Set the modified content
      p.innerHTML = tempDiv.innerHTML;
      column2.appendChild(p);
      
      // Add line break between paragraphs except for the last one
      if (index < paragraphs.length - 1) {
        column2.appendChild(document.createElement('br'));
      }
    });
  }

  // Add the row with title and all paragraphs
  cells.push([column1, column2]);

  return WebImporter.DOMUtils.createTable(cells, document);
};

// const adjustLinks = (element) => {
//   const link = element.querySelector('a');
//   if (link && link.href.endsWith('/')) {
//     link.href = link.href.slice(0, -1);
//   }
// };

const parseDefaultContent = (main, document) => {
  // First try to find the hero section
  const hero = main.querySelector('section[data-section-id]');
  let insertAfterElement = null;
  
  if (hero) {
    console.log('Found hero section');
    // Get the element with data-current-styles attribute
    let heroImage = null;
    try {
      const stylesAttr = hero.getAttribute('data-current-styles');
      // Remove escaped quotes
      const cleanStylesAttr = stylesAttr.replace(/&quot;/g, '"');
      const styles = JSON.parse(cleanStylesAttr);
      if (styles.backgroundImage && styles.backgroundImage.assetUrl) {
        // Create an img element with the assetUrl
        heroImage = document.createElement('img');
        heroImage.src = styles.backgroundImage.assetUrl;
        // Set alt text from filename if available
        if (styles.backgroundImage.filename) {
          heroImage.alt = styles.backgroundImage.filename.replace(/\.[^/.]+$/, ''); // Remove extension
        }
        console.log('Created hero image with src:', heroImage.src);
      }
    } catch (e) {
      console.log('Error parsing data-current-styles:', e);
    }

    // Find the content wrapper
    const contentWrapper = hero.querySelector('.fluid-engine');
    if (contentWrapper) {
      const heroTitle = contentWrapper.querySelector('.sqs-block-content h2');
      // Get all paragraphs
      const paragraphs = contentWrapper.querySelectorAll('.sqs-block-content p');
      const heroMiniTitle = paragraphs.length > 0 ? paragraphs[0] : null; // First paragraph as mini title
      const heroDescription = paragraphs.length > 1 ? paragraphs[1] : null; // Second paragraph as description

      console.log('Found elements:', {
        heroTitle: !!heroTitle,
        heroMiniTitle: !!heroMiniTitle,
        heroDescription: !!heroDescription
      });

      if (heroImage && heroTitle && heroMiniTitle && heroDescription) {
        console.log('Creating hero block with all elements');
        const heroBlock = createHero(heroImage, heroMiniTitle, heroTitle, heroDescription);
        main.prepend(heroBlock);
        insertAfterElement = heroBlock;
        hero.remove();
      } else {
        console.log('Missing required elements for hero block');
      }
    }
  } else {
    console.log('Hero section not found');
  }

  let allSections = main.querySelectorAll('article .fluid-engine');
  const columnSections = allSections[0];
  
  if (columnSections) {
    console.log('Found columnSections');
    
    // Get all content blocks first
    const allContentBlocks = columnSections.querySelectorAll('.sqs-block-content');
    console.log('Total content blocks:', allContentBlocks.length);
    
    // Get all paragraphs and their parent blocks
    const paragraphBlocks = Array.from(allContentBlocks).map((block, index) => {
      const paragraphs = block.querySelectorAll('p');
      return {
        block,
        index,
        paragraphs: paragraphs.length,
        hasTitle: !!block.querySelector('h3')
      };
    });
    
    console.log('Block analysis:', paragraphBlocks.map(b => 
      `Block ${b.index}: ${b.paragraphs} paragraphs, ${b.hasTitle ? 'has title' : 'no title'}`
    ));

    // Get titles
    const titleBlocks = paragraphBlocks.filter(b => b.hasTitle);
    console.log('Title blocks found:', titleBlocks.length);

    if (titleBlocks.length >= 2) {
      // For each title block, get the content up until the next title
      const contentPairs = titleBlocks.map((titleBlock, i) => {
        const nextTitleIndex = titleBlocks[i + 1]?.index ?? paragraphBlocks.length;
        // Get all blocks between this title and the next title
        const contentBlocks = paragraphBlocks
          .slice(titleBlock.index, nextTitleIndex)
          .map(b => b.block);
        
        return {
          title: titleBlock.block.querySelector('h3'),
          content: contentBlocks
        };
      });
      
      console.log('Content pairs:', contentPairs.map((pair, i) => 
        `Pair ${i}: ${pair.content.length} blocks`
      ));
      
      const columnsBlock = createColumns(
        [contentPairs[0].title, contentPairs[1].title],
        [contentPairs[0].content, contentPairs[1].content]
      );
      
      if (insertAfterElement) {
        insertAfterElement.after(columnsBlock);
        insertAfterElement = columnsBlock;
      } else {
        main.prepend(columnsBlock);
        insertAfterElement = columnsBlock;
      }
      
      const divider = document.createElement('hr');
      columnsBlock.after(divider);
      insertAfterElement = divider;
      
      columnSections.remove();
    }
  }

  allSections = main.querySelectorAll('article .fluid-engine');
  const quoteSection = allSections[0];

  if (quoteSection) {
    const quoteContent = quoteSection.querySelector('.sqs-block-content h4');
    const quoteAttribution = quoteSection.querySelector('.sqs-block-content p');
    if (quoteContent) {
      console.log('Found quote content:', quoteContent.innerHTML);
      const quoteBlock = createQuote(quoteContent, quoteAttribution);
      
      // Create section metadata block
      const sectionMetadataBlock = createSectionMetadata(['red-background'], {});
      
      // Create divider
      const divider = document.createElement('hr');
      
      if (insertAfterElement) {
        // Add all elements in sequence
        insertAfterElement.after(quoteBlock);
        quoteBlock.after(sectionMetadataBlock);
        sectionMetadataBlock.after(divider);
        insertAfterElement = divider;
      } else {
        // Add all elements in sequence at the start
        main.prepend(divider);
        main.prepend(sectionMetadataBlock);
        main.prepend(quoteBlock);
        insertAfterElement = divider;
      }
      
      quoteSection.remove();
    }
  }

  allSections = main.querySelectorAll('article .fluid-engine');
  const columnSection = allSections[0];

  if (columnSection) {
    const sectionTitle = columnSection.querySelector('.sqs-block-content h3');
    const allBlocks = columnSection.querySelectorAll('.sqs-block-content');
    const paragraphs = [];
    const blocksToRemove = new Set();
    let foundImage = false;
    let imageBlockIndex = -1;
    let imageBlocks = [];
    
    // First find the image block
    for (let i = 0; i < allBlocks.length; i++) {
      if (allBlocks[i].querySelector('img')) {
        foundImage = true;
        if (imageBlockIndex === -1) {
          imageBlockIndex = i;
        }
        imageBlocks.push(allBlocks[i]);
      }
    }
    
    // Collect paragraphs until we find the first image block
    for (let i = 0; i < imageBlockIndex; i++) {
      const block = allBlocks[i];
      // Get all paragraphs from the html-content div
      const htmlContent = block.querySelector('.sqs-html-content');
      if (htmlContent) {
        const blockParagraphs = htmlContent.querySelectorAll('p');
        if (blockParagraphs.length > 0) {
          blockParagraphs.forEach(p => paragraphs.push(p));
          blocksToRemove.add(block);
        }
      } else {
        // Fallback to direct paragraph search if no html-content div
        const blockParagraphs = block.querySelectorAll('p');
        if (blockParagraphs.length > 0) {
          blockParagraphs.forEach(p => paragraphs.push(p));
          blocksToRemove.add(block);
        }
      }
    }
    
    // Create first columns block
    if (sectionTitle && paragraphs.length > 0) {
      const columnsBlock = createColumnsWithAllParagraphs(sectionTitle, paragraphs);
      if (insertAfterElement) {
        insertAfterElement.after(columnsBlock);
        insertAfterElement = columnsBlock;
      } else {
        main.prepend(columnsBlock);
        insertAfterElement = columnsBlock;
      }
      
      // Only remove the blocks we've processed
      blocksToRemove.forEach(block => block.remove());
      // Remove the title block separately since it might not have paragraphs
      sectionTitle.closest('.sqs-block-content').remove();
    }

    // Add all image blocks in sequence
    if (imageBlocks.length > 0) {
      imageBlocks.forEach(imgBlock => {
        if (insertAfterElement) {
          insertAfterElement.after(imgBlock);
          insertAfterElement = imgBlock;
        } else {
          main.prepend(imgBlock);
          insertAfterElement = imgBlock;
        }
      });
    }

    // Process blocks after the last image
    if (foundImage && imageBlockIndex < allBlocks.length - 1) {
      const remainingParagraphs = [];
      let nextTitle = null;

      // Look for next title and paragraphs after the last image block
      const lastImageIndex = imageBlocks.length > 0 ? 
        Array.from(allBlocks).indexOf(imageBlocks[imageBlocks.length - 1]) : 
        imageBlockIndex;

      for (let i = lastImageIndex + 1; i < allBlocks.length; i++) {
        const block = allBlocks[i];
        // First check for h3 in this block
        const h3 = block.querySelector('h3');
        if (h3 && !nextTitle) {
          nextTitle = h3;
          continue;
        }

        // Then get all paragraphs from the html-content div
        const htmlContent = block.querySelector('.sqs-html-content');
        if (htmlContent) {
          const blockParagraphs = htmlContent.querySelectorAll('p');
          if (blockParagraphs.length > 0) {
            blockParagraphs.forEach(p => remainingParagraphs.push(p));
            blocksToRemove.add(block);
          }
        } else {
          // Fallback to direct paragraph search if no html-content div
          const blockParagraphs = block.querySelectorAll('p');
          if (blockParagraphs.length > 0) {
            blockParagraphs.forEach(p => remainingParagraphs.push(p));
            blocksToRemove.add(block);
          }
        }
      }

      // Create second columns block
      if (nextTitle && remainingParagraphs.length > 0) {
        console.log('Found paragraphs:', remainingParagraphs.length);
        const nextColumnsBlock = createColumnsWithAllParagraphs(nextTitle, remainingParagraphs);
        if (insertAfterElement) {
          insertAfterElement.after(nextColumnsBlock);
          insertAfterElement = nextColumnsBlock;
        } else {
          main.prepend(nextColumnsBlock);
          insertAfterElement = nextColumnsBlock;
        }

        // Check if there are more sections after this one
        const remainingSections = main.querySelectorAll('article .fluid-engine');
        if (remainingSections.length > 1) {  // If there are more sections after this
          // Add divider after the second columns block
          const divider = document.createElement('hr');
          nextColumnsBlock.after(divider);
          insertAfterElement = divider;
        }

        // Remove the processed blocks
        blocksToRemove.forEach(block => block.remove());
        // Remove the title block
        nextTitle.closest('.sqs-block-content').remove();
      }
    }

    // Remove the section only if all blocks have been processed
    if (columnSection.querySelectorAll('.sqs-block-content').length === 0) {
      columnSection.remove();
    }
  }

  allSections = main.querySelectorAll('article .fluid-engine');
  const quoteSect = allSections[0];

  if (quoteSect) {
    const quoteContent = quoteSect.querySelector('.sqs-block-content h4');
    const quoteAttribution = quoteSect.querySelector('.sqs-block-content p');
    if (quoteContent) {
      console.log('Found quote content:', quoteContent.innerHTML);
      const quoteBlock = createQuote(quoteContent, quoteAttribution);
      
      // Create section metadata block
      const sectionMetadataBlock = createSectionMetadata(['red-background'], {});
      
      // Add blocks in sequence
      if (insertAfterElement) {
        insertAfterElement.after(quoteBlock);
        quoteBlock.after(sectionMetadataBlock);
        insertAfterElement = sectionMetadataBlock;
      } else {
        main.prepend(sectionMetadataBlock);
        main.prepend(quoteBlock);
        insertAfterElement = sectionMetadataBlock;
      }
      
      quoteSect.remove();
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