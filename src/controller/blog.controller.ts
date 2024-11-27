import { NextFunction, Request, Response } from "express";
import { getArticles } from "../service/article.service";

export function homePage(req: Request, res: Response, next: NextFunction) {
  const articles = getArticles();
  res.render("home", { articles });
}
