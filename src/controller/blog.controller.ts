import { NextFunction, Request, Response } from "express";
import { getArticles, getArticleById } from "../service/article.service";

export function homePage(req: Request, res: Response, next: NextFunction) {
  const articles = getArticles();
  res.render("home", { articles });
}

export function singleArticle(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params["id"]);
  if (isNaN(id)) {
    next();
  }
  const article = getArticleById(id);
  if (article.length === 0) {
    return res.render("404");
  }
  res.render("single-article", { article: article[0] });
}
