export interface Article {
  title: string;
  slug: string;
  content: string;
  author: string;
  date: string;
}

export interface StoredArticle extends Omit<Article, "date"> {
  publishDate: string;
  id: number | undefined;
}
