import fs from "node:fs";
import { StoredArticle, Article } from "../models/article";

let articles: StoredArticle[] = JSON.parse(
  fs.readFileSync("articles.json", "utf-8")
);

let newId =
  articles.length === 0
    ? 1
    : Math.max(...articles.map((article: any) => article.id)) + 1;

export function getArticles(): Article[] {
  return articles.map<Article>((article) => {
    return {
      title: article.title,
      content: article.content,
      date: article.publishDate,
      author: article.author,
      slug: article.slug,
    };
  });
}

export function getArticleById(id: number): Article | null {
  if (isNaN(id) || id <= 0 || id > articles.length) {
    return null;
  }
  return {
    title: articles[id - 1].title,
    content: articles[id - 1].content,
    date: articles[id - 1].publishDate,
    author: articles[id - 1].author,
    slug: articles[id - 1].slug,
  };
}

export function getArticle(slug: string): Article | null {
  const article = articles.find((article) => article.slug === slug);
  if (!article) {
    return null;
  }

  return {
    title: article.title,
    slug: article.slug,
    content: article.content,
    date: article.publishDate,
    author: article.author,
  };
}

export function save(
  article: Partial<Article>,
  user: string
): {
  slug: string | null;
  errMsg: string | null;
} {
  if (!article.title || !article.content || !article.author) {
    return {
      slug: null,
      errMsg: "Missing article information.",
    };
  }

  if (user !== article.author) {
    return {
      errMsg: `Only author can create an article.`,
      slug: null,
    };
  }

  let slug = `s-${newId}`;

  articles.push({
    title: article.title!,
    content: article.content!,
    author: article.author!,
    publishDate: new Date().toString(),
    id: newId,
    slug,
  });

  newId++;

  return {
    slug: slug,
    errMsg: null,
  };
}

export function update(
  id: number,
  article: Partial<Article>,
  user: string
): {
  slug: string | null;
  errMsg: string | null;
} {
  if (isNaN(id) || id <= 0 || id > articles.length) {
    return {
      errMsg: `Article with id: ${id} is not exist.`,
      slug: null,
    };
  }

  if (user !== articles[id - 1].author) {
    return {
      errMsg: `Only author update the article.`,
      slug: null,
    };
  }

  if (!article.title && !article.content) {
    return {
      slug: null,
      errMsg: "Article must have title and content.",
    };
  }

  articles[id - 1].slug = `ns-${id}`;
  articles[id - 1].title = article.title!;
  articles[id - 1].content = article.content!;

  return {
    slug: `ns-${id}`,
    errMsg: null,
  };
}
