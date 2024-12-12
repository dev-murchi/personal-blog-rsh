import { NextFunction, Request, Response } from "express";
import { articleService } from "../service/article.service";
import { ArticleFormError, CustomError } from "../models/custom-error";

class ArticleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;

      if (!content || !content.trim() || !title || !title.trim()) {
        throw new ArticleFormError(
          {
            title,
            content,
          },
          "Please provide both title and content of the article!"
        );
      }

      const response = await articleService.save({
        title,
        content,
        author: "Murchi",
        slug: "",
        date: "",
      });

      if (response.error !== null) {
        throw new ArticleFormError(
          {
            title,
            content,
          },
          response.error
        );
      }

      res.redirect("/article/" + response.data[0].slug);
    } catch (error) {
      if (error instanceof ArticleFormError) {
        return res.status(400).render("article-form", {
          title: error.article.title,
          content: error.article.content,
          error: error.message,
        });
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const { content } = req.body;

      if (!slug || !slug.trim()) {
        throw new CustomError("Article is not found!", 404);
      }

      const oldArticle = await articleService.getArticle(slug);
      if (oldArticle.length === 0) {
        throw new CustomError("Article is not found!", 404);
      }

      if (!content || !content.trim()) {
        throw new ArticleFormError(
          {
            title: oldArticle[0].title,
            content,
          },
          "Please provide the content of the article!"
        );
      }

      const response = await articleService.update(slug, content);

      if (response.error !== null) {
        throw new ArticleFormError(
          {
            title: oldArticle[0].title,
            content,
          },
          response.error
        );
      }
      res.redirect("/article/" + response.data[0].slug);
    } catch (error) {
      if (error instanceof ArticleFormError) {
        return res.status(400).render("article-form", {
          title: error.article.title,
          content: error.article.content,
          error: error.message,
        });
      }

      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      console.log({ slug });

      if (!slug || !slug.trim()) {
        throw new CustomError("Article is not found!", 404);
      }

      const response = await articleService.delete(slug);

      if (response.length === 0) {
        throw new CustomError("Article is not found!", 404);
      }

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
