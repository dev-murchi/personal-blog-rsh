import express from "express";
import { articleController } from "../controller/article.controller";
import { authanticateUser, authorizeUser } from "../middleware/auth.middleware";

export const articleRouter = express.Router();

articleRouter
  .route("/new")
  .get(authanticateUser, authorizeUser, articleController.displayCreatePage)
  .post(authanticateUser, authorizeUser, articleController.create);

articleRouter
  .route("/:slug")
  .get(articleController.displayArticle)
  .delete(authanticateUser, authorizeUser, articleController.delete);
articleRouter
  .route("/:slug/edit")
  .get(authanticateUser, authorizeUser, articleController.displayEditPage)
  .post(authanticateUser, authorizeUser, articleController.update);
