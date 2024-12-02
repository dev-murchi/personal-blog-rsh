import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).render("error", { error: "Page not found!" });
}
