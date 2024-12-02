import { NextFunction, Request, Response } from "express";
import * as articleService from "../service/article.service";
import { Article } from "../models/article";

export function createArticle(req: Request, res: Response, next: NextFunction) {
  createOrUpdate("create", req, res, next);
}

export function updateArticle(req: Request, res: Response, next: NextFunction) {
  createOrUpdate("update", req, res, next);
}

function createOrUpdate(
  op: "create" | "update",
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let resp: {
      success: boolean;
      errMsg: string | null;
      id: number | undefined;
    };

    const { title, publishDate, content } = req.body;
    const regexOnlyNumber = /^[0-9]+$/;

    const articleId =
      op !== "update"
        ? NaN
        : !regexOnlyNumber.test(req.params["id"])
        ? NaN
        : parseInt(req.params["id"]);
    const formTitle = op !== "update" ? "Create Article" : "Edit Article";

    resp = articleService.saveOrUpdateArticle(
      op,
      title,
      content,
      publishDate,
      "Murchi",
      articleId
    );

    if (!resp.success) {
      return res.status(400).render("article-form", {
        title: formTitle,
        article: new Article(title, content, publishDate),
        error: resp.errMsg,
      });
    } else {
      res.redirect("/article/" + resp.id);
    }
  } catch (error) {
    next(error);
  }
}
