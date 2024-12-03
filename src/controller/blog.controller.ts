import { NextFunction, Request, Response } from "express";
import * as articleService from "../service/article.service";
import { Article } from "../models/article";
import { CustomError } from "../models/custom-error";

export function createArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const formTitle = "Create Article";
    const { title, content } = req.body;

    const article: Partial<Article> = {
      title,
      content,
      author: "Murchi",
    };

    const resp = articleService.save(article, "Murchi");

    if (!resp.slug) {
      return res.status(400).render("article-form", {
        title: formTitle,
        article,
        error: resp.errMsg,
      });
    } else {
      res.redirect("/article/" + resp.slug);
    }
  } catch (error) {
    next(error);
  }
}

export function updateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const regexOnlyNumber = /^[0-9]+$/;
    const id = req.query["id"] as string;

    if (!regexOnlyNumber.test(id)) {
      throw new CustomError("Article is not foundx!", 404);
    }

    const formTitle = "Edit Article";
    const { title, content } = req.body;

    const article: Partial<Article> = {
      title,
      content,
    };

    let resp = articleService.update(parseInt(id), article, "Murchi");

    if (!resp.slug) {
      return res.status(400).render("article-form", {
        title: formTitle,
        article,
        error: resp.errMsg,
      });
    } else {
      res.redirect("/article/" + resp.slug);
    }
  } catch (error) {
    next(error);
  }
}
