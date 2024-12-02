import express from "express";

import * as pageController from "../controller/page.controller";
import * as loginController from "../controller/login.controller";
export const loginRouter = express.Router();

loginRouter
  .route("/")
  .get(pageController.loginPage)
  .post(loginController.login);
