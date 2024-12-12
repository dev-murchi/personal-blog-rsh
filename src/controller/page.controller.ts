import { NextFunction, Request, Response } from "express";
import { articleService } from "../service/article.service";
import { CustomError } from "../models/custom-error";

class PageController {
  async home(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = (await articleService.getArticles()).map((article) => {
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

  async article(req: Request, res: Response, next: NextFunction) {
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
      res.render("article-detail", { article: article[0], admin: false });
    } catch (error) {
      next(error);
    }
  }

  async admin(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("admin", { user: (req as any).user.username });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("login", { error: undefined, page: "login" });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("login", { error: undefined, page: "register" });
    } catch (error) {
      next(error);
    }
  }

  async articleCreate(req: Request, res: Response, next: NextFunction) {
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

  async articleEdit(req: Request, res: Response, next: NextFunction) {
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
}

export const pageController = new PageController();
