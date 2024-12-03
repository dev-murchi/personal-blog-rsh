import { NextFunction, Request, Response } from "express";

export class SignInControler {
  login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res
          .status(400)
          .render("login", { error: "Please provide valid credentials!" });
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      next(error);
    }
  }
}

export const signInControler = new SignInControler();
