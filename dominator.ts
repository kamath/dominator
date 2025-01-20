/**
 * Checks if the content of an element is the desired content
 *
 * @param content - The content to check
 * @returns Whether the content is the desired content
 */
async function hasContent(content: Element, prompt: string) {
  return content.textContent === prompt;
}

/**
 * Gets the XPath of an element
 *
 * @param element - The element to get the XPath of
 * @returns The XPath of the element
 */
function getXPath(element: Element): string {
  if (!element.parentElement) {
    return "/" + element.tagName.toLowerCase();
  }

  let siblings = Array.from(element.parentElement.children);
  let index = siblings.indexOf(element) + 1;
  let tagCount = siblings.filter(
    (sibling) => sibling.tagName === element.tagName
  ).length;

  let xpath =
    getXPath(element.parentElement) + "/" + element.tagName.toLowerCase();

  if (tagCount > 1) {
    xpath += "[" + index + "]";
  }

  return xpath;
}

/**
 * Finds an element with the desired content
 *
 * @param elements - The elements to search
 * @returns The element with the desired content and its XPath
 */
async function findElementWithContent(
  elements: Element[],
  prompt: string
): Promise<{ element: Element; xpath: string } | null> {
  for (const element of elements) {
    if (await hasContent(element, prompt)) {
      return { element, xpath: getXPath(element) };
    }

    const childElements = Array.from(element.children);
    if (childElements.length > 0) {
      const found = await findElementWithContent(childElements, prompt);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function DOMinator(body: HTMLBodyElement) {
  const children = Array.from(body?.children || []);
  return {
    findElementWithContent: (prompt: string) =>
      findElementWithContent(children, prompt),
  };
}
