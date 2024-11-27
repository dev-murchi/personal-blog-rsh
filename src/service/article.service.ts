import fs from "node:fs";

let articles: any = JSON.parse(fs.readFileSync("articles.json", "utf-8"));

export function getArticles(): any {
  return articles.map((article: any) => {
    return {
      ...article,
      publishDate: new Date(article.publishDate).toDateString(),
    };
  });
}
