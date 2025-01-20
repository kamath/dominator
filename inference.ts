/**
 * Checks if the content of an element is the desired content
 *
 * @param content - The content to check
 * @returns Whether the content is the desired content
 */
export async function hasContent(content: Element, prompt: string) {
  // Check if this element's direct text content matches
  const thisText = Array.from(content.childNodes)
    .filter((node) => node.nodeType === 3) // Text nodes only
    .map((node) => node.textContent?.trim())
    .join(" ");

  if (thisText.includes(prompt)) {
    return "this";
  }

  // Check children
  for (const child of Array.from(content.children)) {
    if (child.textContent?.includes(prompt)) {
      return "child";
    }
  }

  return "no";
}
