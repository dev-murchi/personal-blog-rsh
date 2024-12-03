import express from "express";
import { pageController } from "../controller/page.controller";
import { articleController } from "../controller/blog.controller";

export const articleRouter = express.Router();

articleRouter
  .route("/new")
  .get(pageController.articleCreate)
  .post(articleController.create);
articleRouter
  .route("/edit")
  .get(pageController.articleEdit)
  .post(articleController.update);
articleRouter.route("/:slug").get(pageController.article);
