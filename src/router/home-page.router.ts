import express from "express";
import { pageController } from "../controller/page.controller";

export const homePageRouter = express.Router();

homePageRouter.route("/").get(pageController.home);
