import { NextFunction, Request, Response } from "express";
import { CustomError } from "../models/custom-error";
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).render("error", { error: err.message });
  } else {
    res.status(500).render("error", { error: "Something went wrong" });
  }
}
