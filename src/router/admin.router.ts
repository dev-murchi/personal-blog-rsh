import express from "express";
import { authanticateUser, authorizeUser } from "../middleware/auth.middleware";
import { adminController } from "../controller/admin.controller";

export const adminRouter = express.Router();

adminRouter
  .route("/")
  .get(authanticateUser, authorizeUser, adminController.displayPage);
