import axios from "axios";
import * as cheerio from "cheerio";

export async function getFirstLine(url: string): Promise<string | null | undefined > {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  const paragraphs = $("article p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean); 

  const cleaned = paragraphs.filter(
    (line) =>
      !line.toLowerCase().startsWith("member-only story") &&
      !line.toLowerCase().includes("sign up") &&
      !line.toLowerCase().includes("upgrade") &&
      !line.toLowerCase().includes("listen") &&
      !line.toLowerCase().includes("Press enter or click to view image in full size") &&
      !line.toLowerCase().includes("share") &&
      !line.toLowerCase().includes("Click here to read for free") &&
      line.length > 3
  );

  const firstLine = cleaned.length > 0 ? cleaned[0] : null;

  return  firstLine ?? null;
}
