import express from "express";
import * as pageController from "../controller/page.controller";

export const indexRouter = express.Router();

indexRouter.route("/").get(pageController.homePage);
