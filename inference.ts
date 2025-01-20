import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
  organization: process.env.OPENAI_ORG_ID ?? undefined,
  baseURL: "http://localhost:11434/v1",
});

/**
 * Checks if the content of an element is the desired content
 *
 * @param content - The content to check
 * @param prompt - The prompt to check for
 * @returns "this" if the content is the desired content, "child" if the content is in a child element, or "no" if the content is not in the element or any of its children
 */
export async function hasContent(
  content: Element,
  prompt: string
): Promise<"this" | "child" | "no"> {
  const llmPrompt = `Given the following HTML element:
${content.outerHTML}

And this target text to find: "${prompt}"

You must respond with exactly one of these words (no other text):
"this" - if the target text is found directly in the element (not in child elements)
"child" - if the target text is found in one of the child elements
"no" - if the target text is not found at all`;

  try {
    const completion = await oai.chat.completions.create({
      messages: [{ role: "user", content: llmPrompt }],
      model: "llama3.2",
      temperature: 0,
    });

    const response = completion.choices[0].message.content
      ?.trim()
      .toLowerCase();

    if (response === "this" || response === "child" || response === "no") {
      return response;
    }
    throw new Error(`Invalid response: ${response}`);
  } catch (error) {
    console.error("Error during inference:", error);
    return "no"; // fallback response
  }
}
