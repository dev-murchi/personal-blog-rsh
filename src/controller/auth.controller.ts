import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user.service";
export class AuthControler {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        res.status(400).render("login", {
          error: "Please provide valid credentials!",
          page: "register",
        });
      } else {
        const userExist = await userService.findUser(email);

        if (userExist.length === 1) {
          return res.status(400).render("login", {
            error: "User already registered!",
            page: "register",
          });
        }

        const user = await userService.saveUser({
          username,
          email,
          password,
          role: "user",
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        });

        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).render("login", {
          error: "Please provide valid credentials!",
          page: "login",
        });
      } else {
        const userExist = await userService.findUser(email);

        if (userExist.length === 0 || userExist[0].password !== password) {
          return res
            .status(400)
            .render("login", { error: "Invalid credentials!", page: "login" });
        }

        res.redirect("/admin");
      }
    } catch (error) {
      next(error);
    }
  }
}

export const authControler = new AuthControler();
