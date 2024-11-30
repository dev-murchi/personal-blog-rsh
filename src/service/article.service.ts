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

export function getArticleById(id: number): Article | null {
  if (isNaN(id) || id <= 0 || id > articles.length) {
    return null;
  }
  return new Article(
    articles[id - 1].title,
    articles[id - 1].content,
    articles[id - 1].publishDate,
    articles[id - 1].author,
    articles[id - 1].id
  );
}

export function saveOrUpdateArticle(
  op: "create" | "update",
  title: string,
  content: string,
  publishDate: string,
  author: string,
  id: number
): { success: boolean; id: number | undefined; errMsg: string | null } {
  if (!title || !content || !publishDate || !author) {
    return {
      success: false,
      errMsg: "Missing article information.",
      id: undefined,
    };
  }

  let artileId: number;

  if (op === "update") {
    if (isNaN(id) || id <= 0 || id > articles.length) {
      return {
        success: false,
        errMsg: "Invalid id is provided.",
        id: id,
      };
    } else {
      artileId = id;
      articles[id - 1].title = title;
      articles[id - 1].content = content;
      articles[id - 1].publishDate = publishDate;
      articles[id - 1].author = author;
    }
  } else {
    articles.push(new Article(title, content, publishDate, author, newId));
    artileId = newId;
    newId++;
  }

  return {
    success: true,
    id: artileId,
    errMsg: null,
  };
}
