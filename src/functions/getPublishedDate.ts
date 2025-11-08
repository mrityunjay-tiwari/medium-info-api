import axios from "axios";
import * as cheerio from "cheerio";

export async function getPublishedDate(url: string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const $ =  cheerio.load(data);

  const date = $('meta[property="article:published_time"]').attr("content");
  
  if(!date) {
    return null
  }

const dateObj = new Date(date)

const publishedDate = dateObj.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

  return publishedDate;
}