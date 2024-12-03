import { NextFunction, Request, Response } from "express";
import * as articleService from "../service/article.service";
import { Article } from "../models/article";
import { CustomError } from "../models/custom-error";
const regexOnlyNumber = /^[0-9]+$/;

class PageController {
  home(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = articleService.getArticles().map((article) => {
        return {
          ...article,
          date: new Date(article.date).toDateString(),
        };
      });
      res.render("home", { articles });
    } catch (error) {
      next(error);
    }
  }

  article(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug) {
        throw new CustomError("Article is not found!", 404);
      }
      const article = articleService.getArticle(slug);

      if (!article) {
        throw new CustomError("Article is not found!", 404);
      }

      article.date = new Date(article.date).toDateString();
      res.render("article-detail", { article: article, admin: false });
    } catch (error) {
      next(error);
    }
  }

  admin(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("admin");
    } catch (error) {
      next(error);
    }
  }

  login(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("login", { error: undefined });
    } catch (error) {
      next(error);
    }
  }

  articleCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const article: Partial<Article> = {
        title: "",
        content: "",
      };
      res.render("article-form", {
        title: "Create Article",
        article,
        error: undefined,
      });
    } catch (error) {
      next("error");
    }
  }

  articleEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query["id"] as string;
      if (!regexOnlyNumber.test(id)) {
        throw new CustomError("Article is not foundx!", 404);
      }

      const article = articleService.getArticleById(parseInt(id));
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
}

export const pageController = new PageController();
