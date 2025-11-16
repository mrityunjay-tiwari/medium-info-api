# medium-info-api

A lightweight utility to extract all the useful information from **Medium articles**, including:
- Title
- Author Name
- Author Avatar
- Page Content
- Main Image
- Publication Date
- Claps Count
- Comments Count
- Initial Line

This package is designed to be **modular**: fast information is fetched immediately.

---

## Installation

```bash
npm install medium-info-api

or 

yarn add medium-info-api

```
## Usage in Node / Express
### Endpoints Example
```

```ts
import express from "express";
import cors from "cors";
import { getArticleInfo } from "medium-info-api";

const app = express();
app.use(cors());

app.get("/medium", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const result = await getArticleInfo(url);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: err
    });
  }
});
```

### How the API Works

Endpoint: /medium?url=<article_url> Purpose: Fetch all article info 


### Example Response

```ts
{
  "success": true,
  "data": {
    "title": "How to Think Clearly",
    "authorName": "John Doe",
    "pageContent": "6 min read",
    "firstLine": "Sample first line",
    "publishedDate": "Sep 20, 2025",
    "clapCount": "1.2k",
    "commentsCount": "72",
    "heroImage": "https://miro.medium.com/v2/resize:fit:1200/1*71nGDtlRxS8JNC0YVwLEBw.jpeg",
    "authorAvatar":"https://miro.medium.com/v2/resize:fill:64:64/1*azHxRVLkd-GHvXxlvgdChw.jpeg"
  },

}
```

### How the package works?

medium-info-api scrapes publicly available data from Medium articles and author pages, without using any heavy browser automation tools, it simply uses axios and cheerio.

1. HTML Fetching with Axios
Medium pages are downloaded using axios, which is significantly faster and lighter than browser-based scrapers.

2. Reliable HTML parsing with Cheerio
Cheerio works to extract information using stable Medium DOM patterns, fallback selectors, and multiple verification layers ensuring accuracy even if Medium slightly changes its layout.

3. Fallback Logics
Fallback logics are provided whereever required e.g. in authorAvatar, the page checks all the possibilities. If Medium changes formatting, it gracefully falls back to a safe default avatar.

4. Full Severless Compatible
Since it only uses axios and cheerio, the applications built on top of this are easily deployable on Vercel, Netlify, AWS Lambda, Supabase Edge, Cloudflare Workers etc.

5. Lightweight and Effecient
The average execution time is around 5-40 ms making it suitable for API Routes, Next.js PPR, Incremental Static Regeneration (ISR), Edge functions, On-demand requests etc.

### Contributing

Pull requests are welcome! If you find issues, feel free to open one.