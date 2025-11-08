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

This package is designed to be **modular**: fast information is fetched immediately, and heavy operations (fetching author avatar) are intentionally separated so the main response stays fast.

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
import { getArticleInfo, getAuthorAvatar } from "medium-info-api";

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

app.get("/medium/avatar", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const result = await getAuthorAvatar(url);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch author avatar",
      error: err
    });
  }
});
```

### How the API Works

Endpoint: /medium?url=<article_url> Purpose: Fetch all article info except author avatar
Endpoint: /medium/avatar?url=<article_url> Purpose: Fetch only the author avatar


### Example Response

{
  "success": true,
  "data": {
    "title": "How to Think Clearly",
    "author": "John Doe",
    "readTime": "6 min read",
    "publishedDate": "Sep 20, 2025",
    "tags": ["productivity", "life", "philosophy"]
  },
  "message": "To fetch author avatar, call: http://localhost:3000/medium/avatar?url=<medium_article_url>"
}


### Why Avatar is Separate?

Fetching the avatar uses Playwright, which:
- Launches a browser instance
- Increases processing time
- Slows down the overall API call if included in the main request

So the design here is:
- Get main article info instantly
- Fetch avatar only when needed
- This keeps your app fast and responsive.


### Contributing

Pull requests are welcome! If you find issues, feel free to open one.
```
