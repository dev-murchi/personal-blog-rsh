import { NextFunction, Request, Response } from "express";
import { articleService } from "../service/article.service";
import { ArticleFormError, CustomError } from "../models/custom-error";

class ArticleController {
  async displayArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug) {
        throw new CustomError("Article is not found!", 404);
      }
      const article = await articleService.getArticle(slug);
      if (article.length === 0) {
        throw new CustomError("Article is not found!", 404);
      }
      article[0].date = new Date(article[0].date).toDateString();
      res.render("article", { article: article[0], admin: false });
    } catch (error) {
      next(error);
    }
  }

  async displayCreatePage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("article-form", {
        title: undefined,
        content: undefined,
        error: undefined,
      });
    } catch (error) {
      next(error);
    }
  }

  async displayEditPage(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    try {
      if (!slug || !slug.trim()) {
        throw new CustomError("Article is not found!", 404);
      }

      const article = await articleService.getArticle(slug);

      if (article.length === 0) {
        throw new CustomError("Article is not found!", 404);
      }

      res.render("article-form", {
        title: article[0].title,
        content: article[0].content,
        error: undefined,
      });
    } catch (error) {
      next(error);
    }
  }

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
