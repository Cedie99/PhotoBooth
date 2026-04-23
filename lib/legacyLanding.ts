import { readFile } from "node:fs/promises";
import path from "node:path";

interface LandingHtmlParts {
  styleTagInnerHtml: string;
  bodyInnerHtml: string;
}

export async function getLegacyLandingHtml(): Promise<LandingHtmlParts> {
  const sourcePath = path.join(process.cwd(), "index.html");
  const html = await readFile(sourcePath, "utf-8");

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!styleMatch || !bodyMatch) {
    throw new Error("Could not parse style/body from index.html");
  }

  return {
    styleTagInnerHtml: styleMatch[1],
    bodyInnerHtml: bodyMatch[1]
  };
}
