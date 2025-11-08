import {chromium} from 'playwright';

export async function getMediumAuthorAvatar(url: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "en-US",
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForTimeout(20000);

    const result = await page.evaluate(() => {
      const toAbsolute = (url: string) => {
        try {
          return new URL(url, document.baseURI).href;
        } catch {
          return url;
        }
      };

      const getSrcFromImg = (img: any) => {
        if (!img) return null;
        if (img.getAttribute("src")) return img.getAttribute("src");
        if (img.getAttribute("data-src")) return img.getAttribute("data-src");
        if (img.dataset && img.dataset.src) return img.dataset.src;
        const ss = img.getAttribute("srcset");
        if (ss) {
          const first = ss.split(",")[0].trim().split(" ")[0];
          if (first) return first;
        }
        return null;
      };

      const getBgImage = (el: any) => {
        if (!el) return null;
        const style = window.getComputedStyle(el);
        const bg = style.backgroundImage || style.getPropertyValue("background-image");
        if (!bg || bg === "none") return null;
        const m = bg.match(/url\(["']?(.*?)["']?\)/);
        return m ? m[1] : null;
      };

      const selectors = [
        'img[data-testid="authorAvatar"]',
        'img[data-testid*="avatar"]',
        'a[data-testid="authorName"] img',
        'div[data-testid="authorName"] img',
        'article header img',               
        'header img',                       
        'img[alt*="Avatar"]',
        'img[alt*="avatar"]'
      ];

      const debug = [];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        debug.push({ selector: sel, found: !!el, outerHTML: el ? el.outerHTML.slice(0, 300) : null });
        const src = getSrcFromImg(el);
        if (src) return { src: toAbsolute(src), debug };
        const bg = getBgImage(el);
        if (bg) return { src: toAbsolute(bg), debug };
      }

      const authorLink =
        document.querySelector('a[href*="/@"]') ||
        document.querySelector('[data-testid="authorName"] a') ||
        document.querySelector('a[data-user-id]');
      if (authorLink) {
        const img = authorLink.querySelector("img");
        debug.push({ selector: 'authorLink -> img', found: !!img, outerHTML: img ? img.outerHTML.slice(0, 300) : null });
        const src = getSrcFromImg(img);
        if (src) return { src: toAbsolute(src), debug };
        const bg = getBgImage(img);
        if (bg) return { src: toAbsolute(bg), debug };
      }

      const imgs = Array.from(document.querySelectorAll("img")).slice(0, 40);
      for (const img of imgs) {
        const rect = img.getBoundingClientRect();
        if ((rect.width && rect.width <= 120) || (rect.height && rect.height <= 120)) {
          const src = getSrcFromImg(img);
          debug.push({ selector: "fallback small img", found: !!img, outerHTML: img.outerHTML.slice(0, 300) });
          if (src) return { src: toAbsolute(src), debug };
        }
      }

      return { src: null, debug };
    });

    if (result && result.src) {
    } else {
      console.warn("Author image not found.");
      console.log("Debug info (first few attempts):", result.debug.slice(0, 6));
    }

    return result.src ?? "https://ik.imagekit.io/mrityunjay/download.png?updatedAt=1762634201648";
  } catch (err) {
    console.error("Error scraping author image:", err);
    return "https://ik.imagekit.io/mrityunjay/download.png?updatedAt=1762634201648";
  } finally {
    await browser.close();
  }
}










