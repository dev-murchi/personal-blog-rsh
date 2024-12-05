import express from "express";
import { pageController } from "../controller/page.controller";
import { authanticateUser, authorizeUser } from "../middleware/auth.middleware";

export const adminRouter = express.Router();

adminRouter
  .route("/")
  .get(authanticateUser, authorizeUser, pageController.admin);
