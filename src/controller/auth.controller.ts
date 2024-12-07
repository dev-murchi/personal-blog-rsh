import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user.service";
import * as jwt from "jsonwebtoken";
export class AuthControler {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).render("login", {
          error: "Please provide valid credentials!",
          page: "register",
        });
      }

      const userExist = await userService.findUser(email);

      if (userExist.length === 1) {
        return res.status(400).render("login", {
          error: "User already registered!",
          page: "register",
        });
      }

      const userCount = await userService.countUsers();
      const role = userCount === 0 ? "admin" : "user";
      const user = await userService.saveUser({
        username,
        email,
        password,
        role,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      });

      res.redirect("/user/login");
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).render("login", {
          error: "Invalid credentials!",
          page: "login",
        });
      }
      const userExist = await userService.findUser(email);

      if (userExist.length === 0 || userExist[0].password !== password) {
        return res
          .status(400)
          .render("login", { error: "Invalid credentials!", page: "login" });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET!);
      res.cookie("mt", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // one day
        signed: true,
      });

      if (userExist[0].role === "admin") {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    } catch (error) {
      next(error);
    }
  }
}

export const authControler = new AuthControler();
