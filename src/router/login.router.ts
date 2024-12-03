import express from "express";

import { pageController } from "../controller/page.controller";
import { signInControler } from "../controller/login.controller";

export const loginRouter = express.Router();

loginRouter.route("/").get(pageController.login).post(signInControler.login);
