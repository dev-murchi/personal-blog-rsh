import express from "express";
import { pageController } from "../controller/page.controller";

export const indexRouter = express.Router();

indexRouter.route("/").get(pageController.home);
