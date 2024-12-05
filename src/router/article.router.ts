import express from "express";
import { pageController } from "../controller/page.controller";
import { articleController } from "../controller/blog.controller";
import { authanticateUser, authorizeUser } from "../middleware/auth.middleware";

export const articleRouter = express.Router();

articleRouter
  .route("/new")
  .get(authanticateUser, authorizeUser, pageController.articleCreate)
  .post(authanticateUser, authorizeUser, articleController.create);
articleRouter
  .route("/edit")
  .get(authanticateUser, authorizeUser, pageController.articleEdit)
  .post(authanticateUser, authorizeUser, articleController.update);
articleRouter.route("/:slug").get(pageController.article);
