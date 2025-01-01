import express from "express";

import { authControler } from "../controller/auth.controller";
import { authanticateUser, authorizeUser } from "../middleware/auth.middleware";

export const authRouter = express.Router();

authRouter
  .route("/login")
  .get(authControler.loginPage)
  .post(authControler.login);

authRouter
  .route("/logout")
  .post(authanticateUser, authorizeUser, authControler.logout);
