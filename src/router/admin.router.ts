import express from "express";
import * as pageController from "../controller/page.controller";

export const adminRouter = express.Router();

adminRouter.route("/").get(pageController.adminPage);
