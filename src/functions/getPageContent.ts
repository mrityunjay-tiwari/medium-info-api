import axios from "axios";
import * as cheerio from "cheerio";

export async function getFullContent(url: string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const $ =  cheerio.load(data);

  const content = $("article").text().trim() || null;
  return content;
}