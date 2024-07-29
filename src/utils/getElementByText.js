const getElementByText = async (page, parent, text) => {
    const selectBy = {
      Description: `[class*="attribute-value"]`,
      Highlights: `ul`,
      Category: `[class*="attribute-value"]`,
    };
  
    const contentType = {
      Description: `textContent`,
      Highlights: `innerHTML`,
      Category: `textContent`,
    };
  
    const descEl = await page.evaluate(
      (el, searchText, selecyBy, contentType) => {
        const elements = Array.from(el.children);
        let descriptionElement = null;
        elements.forEach((item) => {
          const labelElement = item.querySelector(`[class*="attribute-label"]`);
  
          if (labelElement && labelElement.textContent.includes(searchText)) {
            const valueElement = item.querySelector(selecyBy[searchText]);
  
            if (valueElement) {
              descriptionElement = {
                element: valueElement,
                content: valueElement[contentType[searchText]],
              };
              return;
            } else {
              descriptionElement = {
                element: null,
                content: "",
              };
            }
          }
        });
  
        return descriptionElement;
      },
      parent,
      text,
      selectBy,
      contentType
    );
  
    return descEl;
  };

  export default getElementByText;