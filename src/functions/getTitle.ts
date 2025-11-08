import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeMediumTitle(url : string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    null;

  return title ;
}

