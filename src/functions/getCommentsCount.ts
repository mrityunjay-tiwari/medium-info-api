import axios from "axios";

export async function getCommentsCount(url: string): Promise<string | null > {
  try {
    const jsonUrl = url.replace(/\/$/, "") + "?format=json";

    const { data } = await axios.get(jsonUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const clean = data.replace("])}while(1);</x>", "");
    const parsed = JSON.parse(clean);

    const comments =
      parsed?.payload?.value?.virtuals?.responsesCreatedCount ?? null;

    return comments ?? null ;

  } catch (err) {
    return  null;
  }
}