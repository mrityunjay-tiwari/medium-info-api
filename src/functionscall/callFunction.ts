import { getMediumAuthorAvatar } from "../functions/getAuthorAvatar.js";
import { getMediumAuthorName } from "../functions/getAuthorName.js";
import { getClapCount } from "../functions/getClapCount.js";
import { getCommentsCount } from "../functions/getCommentsCount.js";
import { getFirstLine } from "../functions/getFirstLine.js";
import { getMediumHeroImage } from "../functions/getHeroImage.js";
import { getFullContent } from "../functions/getPageContent.js";
import { getPublishedDate } from "../functions/getPublishedDate.js";
import { scrapeMediumTitle } from "../functions/getTitle.js";
import type { MediumArticleInfo } from "../types.js";

let link : string

export const getArticleInfo = async (link: string): Promise<MediumArticleInfo> => {
  const [
    title,
    authorName,
    pageContent,
    firstLine,
    publishedDate,
    clapCount,
    commentsCount,
    heroImage
  ] = await Promise.all([
    scrapeMediumTitle(link),
    getMediumAuthorName(link),
    getFullContent(link),
    getFirstLine(link),
    getPublishedDate(link),
    getClapCount(link),
    getCommentsCount(link),
    getMediumHeroImage(link),
  ]);

  return {
    title,
    authorName,
    pageContent,
    firstLine,
    publishedDate,
    clapCount,
    commentsCount,
    heroImage,
  };
};

export const getAuthorAvatar = async (link: string) => {
  const [
    authorAvatar    
  ] = await Promise.all([
    getMediumAuthorAvatar(link)
  ]);

  return {
    authorAvatar
  };
};

