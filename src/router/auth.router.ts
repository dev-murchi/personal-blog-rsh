import express from "express";

import { pageController } from "../controller/page.controller";
import { authControler } from "../controller/auth.controller";

export const authRouter = express.Router();

authRouter.route("/login").get(pageController.login);
authRouter
  .route("/register")
  .get(pageController.register)
  .post(authControler.register);
