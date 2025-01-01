import { NextFunction, Request, Response } from "express";

class AdminController {
  constructor() {}

  async displayPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("admin", { user: (req as any).user.username });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
