import { NextFunction, Request, Response } from "express";
import { articleService } from "../service/article.service";

class HomePageController {
  constructor() {}
  async displayHomePage(req: Request, res: Response, next: NextFunction) {
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
}

export const homePageController = new HomePageController();
