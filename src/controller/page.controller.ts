import { NextFunction, Request, Response } from "express";
import * as articleService from "../service/article.service";
import { Article } from "../models/article";
const regexOnlyNumber = /^[0-9]+$/;
export function homePage(req: Request, res: Response, next: NextFunction) {
  const articles = articleService.getArticles().map((article: any) => {
    return {
      ...article,
      publishDate: new Date(article.publishDate).toDateString(),
    };
  });
  res.render("home", { articles });
}

export function articlePage(req: Request, res: Response, next: NextFunction) {
  if (!regexOnlyNumber.test(req.params["id"])) {
    return res.status(404).render("404");
  }
  const article = articleService.getArticleById(parseInt(req.params["id"]));

  if (!article) {
    return res.status(404).render("404");
  }

  article.publishDate = new Date(article.publishDate).toDateString();
  res.render("article-detail", { article: article, admin: false });
}

export function adminPage(req: Request, res: Response, next: NextFunction) {
  res.render("admin");
}

export function loginPage(req: Request, res: Response, next: NextFunction) {
  res.render("login");
}

export function articleCreatePage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const article = new Article();
  res.render("article-form", {
    title: "Create Article",
    article,
    error: undefined,
  });
}

export function articleEditPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!regexOnlyNumber.test(req.params["id"])) {
    return res.status(404).render("404");
  }
  const article = articleService.getArticleById(parseInt(req.params["id"]));
  if (!article) {
    return res.status(404).render("404");
  }

  res.render("article-form", {
    title: "Edit Article",
    article,
    error: undefined,
  });
}
