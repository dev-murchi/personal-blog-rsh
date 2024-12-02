import { NextFunction, Request, Response } from "express";
import * as articleService from "../service/article.service";
import { Article } from "../models/article";
import { CustomError } from "../models/custom-error";
const regexOnlyNumber = /^[0-9]+$/;
export function homePage(req: Request, res: Response, next: NextFunction) {
  try {
    const articles = articleService.getArticles().map((article: any) => {
      return {
        ...article,
        publishDate: new Date(article.publishDate).toDateString(),
      };
    });
    res.render("home", { articles });
  } catch (error) {
    next(error);
  }
}

export function articlePage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!regexOnlyNumber.test(req.params["id"])) {
      throw new CustomError("Article is not found!", 404);
    }
    const article = articleService.getArticleById(parseInt(req.params["id"]));

    if (!article) {
      throw new CustomError("Article not found!", 404);
    }

    article.publishDate = new Date(article.publishDate).toDateString();
    res.render("article-detail", { article: article, admin: false });
  } catch (error) {
    next(error);
  }
}

export function adminPage(req: Request, res: Response, next: NextFunction) {
  try {
    res.render("admin");
  } catch (error) {
    next(error);
  }
}

export function loginPage(req: Request, res: Response, next: NextFunction) {
  try {
    res.render("login", { error: undefined });
  } catch (error) {
    next(error);
  }
}

export function articleCreatePage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const article = new Article();
    res.render("article-form", {
      title: "Create Article",
      article,
      error: undefined,
    });
  } catch (error) {
    next(error);
  }
}

export function articleEditPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!regexOnlyNumber.test(req.params["id"])) {
      throw new CustomError("Article is not found!", 404);
    }
    const article = articleService.getArticleById(parseInt(req.params["id"]));
    if (!article) {
      throw new CustomError("Article is not found!", 404);
    }

    res.render("article-form", {
      title: "Edit Article",
      article,
      error: undefined,
    });
  } catch (error) {
    next(error);
  }
}
