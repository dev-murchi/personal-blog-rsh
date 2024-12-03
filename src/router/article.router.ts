import express from "express";
import * as pageController from "../controller/page.controller";
import * as blogController from "../controller/blog.controller";

export const articleRouter = express.Router();

articleRouter
  .route("/new")
  .get(pageController.articleCreatePage)
  .post(blogController.createArticle);
articleRouter
  .route("/edit")
  .get(pageController.articleEditPage)
  .post(blogController.updateArticle);
articleRouter.route("/:slug").get(pageController.articlePage);
