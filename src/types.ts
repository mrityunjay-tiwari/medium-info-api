export interface MediumArticleInfo {
  title: string | null;
  authorAvatar?: string | null;
  authorName: string | null;
  pageContent: string | null;
  firstLine: string | null | undefined;
  publishedDate: string | null;
  clapCount: string | number | null;
  commentsCount: string | number | null;
  heroImage: string | null;
}
