import fs from "node:fs";
import { Article } from "../models/article";

let articles: Article[] = JSON.parse(fs.readFileSync("articles.json", "utf-8"));

let newId =
  articles.length === 0
    ? 1
    : Math.max(...articles.map((article: any) => article.id)) + 1;

export function getArticles(): Article[] {
  return articles.map((article) => {
    return new Article(
      article.title,
      article.content,
      article.publishDate,
      article.author,
      article.id
    );
  });
}

export function getArticleById(id: number): Article | undefined {
  if (id <= 0 || id > articles.length) {
    return undefined;
  }
  return new Article(
    articles[id - 1].title,
    articles[id - 1].content,
    articles[id - 1].publishDate,
    articles[id - 1].author,
    articles[id - 1].id
  );
}
