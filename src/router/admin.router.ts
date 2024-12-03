import express from "express";
import { pageController } from "../controller/page.controller";

export const adminRouter = express.Router();

adminRouter.route("/").get(pageController.admin);
