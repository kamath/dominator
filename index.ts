import { DOMinator } from "./dominator";
import { JSDOM } from "jsdom";

const prompt =
  "Show HN: Stagehand – an open source browser automation framework powered by AI";

const html = Bun.file("dom.html");
const contents = await html.text(); // contents as a string

const dom = new JSDOM(contents);
const doc = dom.window.document;

const body = doc.querySelector("body");

if (!body) {
  throw new Error("Body not found");
}

const dominator = DOMinator(body);

const elementWithContent = await dominator.findElementWithContent(prompt);
console.log("Found element:", elementWithContent?.element.outerHTML);
console.log("XPath:", elementWithContent?.xpath);
