import axios from "axios";
import * as cheerio from "cheerio";

export async function getMediumAuthorAvatar(url: string): Promise<string> {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    // Known Medium avatar selectors
    const selectors = [
      'img[data-testid="authorAvatar"]',
      'img[alt*="avatar"]',
      'img[src*="medium.com/_/stat?"]',          // Medium CDN avatar
      'a[href*="/@"] img',                       // Author profile link → img inside
      'figure img[width][height]',               // Medium small avatar usually fixed size
    ];

    // Extract src safely
    const extractSrc = (img: cheerio.Cheerio<any>): string | null => {
      if (!img || img.length === 0) return null;

      const src =
        img.attr("src") ||
        img.attr("data-src") ||
        img.attr("data-image-src") ||
        undefined;

      if (typeof src === "string" && src.trim().length > 5) {
        return new URL(src, url).href; // convert relative → absolute
      }

      // srcset fallback
      const srcset = img.attr("srcset");
      if (srcset) {
        const first = srcset.split(",")[0]?.trim().split(" ")[0];
        if (first) return new URL(first, url).href;
      }

      return null;
    };

    // Try primary selectors
    for (const sel of selectors) {
      const img = $(sel).first();
      const src = extractSrc(img);
      if (src) return src;
    }

    // Last fallback → find first small square-ish image
    const fallbackImg = $("img")
      .filter(function () {
        const w = parseInt($(this).attr("width") || "0");
        const h = parseInt($(this).attr("height") || "0");
        return w > 30 && w < 200 && h > 30 && h < 200;
      })
      .first();

    const fallbackSrc = extractSrc(fallbackImg);
    if (fallbackSrc) return fallbackSrc;

    // Default fallback
    return "https://ik.imagekit.io/mrityunjay/download.png";
  } catch (err) {
    console.error("Error scraping avatar:", err);
    return "https://ik.imagekit.io/mrityunjay/download.png";
  }
}
