import express from "express";

import { authControler } from "../controller/auth.controller";
import { authanticateUser } from "../middleware/auth.middleware";

export const authRouter = express.Router();

authRouter
  .route("/register")
  .get(authControler.registerPage)
  .post(authControler.register);

authRouter
  .route("/login")
  .get(authControler.loginPage)
  .post(authControler.login);

authRouter.route("/logout").post(authanticateUser, authControler.logout);
