import fs from "node:fs";

let articles: any = JSON.parse(fs.readFileSync("articles.json", "utf-8"));
function changePublishDateToDateString(article: any) {
  return {
    ...article,
    publishDate: new Date(article.publishDate).toDateString(),
  };
}
export function getArticles(): any {
  return articles.map(changePublishDateToDateString);
}

export function getArticleById(id: number): any[] {
  if (id <= 0 || id > articles.length) {
    return [];
  }
  const article: any[] = [articles[id - 1]].map(changePublishDateToDateString);
  return article;
}
