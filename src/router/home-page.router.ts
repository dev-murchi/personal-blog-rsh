import express from "express";
import { homePageController } from "../controller/home-page.controller";

export const homePageRouter = express.Router();

homePageRouter.route("/").get(homePageController.displayHomePage);
