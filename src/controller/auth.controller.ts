import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user.service";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export class AuthControler {
  async registerPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("login", { error: undefined, page: "register" });
    } catch (error) {
      next(error);
    }
  }

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

      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hash = await bcrypt.hash(password, salt);

      const user = await userService.saveUser({
        username,
        email,
        password: hash,
        role: "user",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      });

      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }

  async loginPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("login", { error: undefined, page: "login" });
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

      if (userExist.length === 0) {
        return res
          .status(400)
          .render("login", { error: "Invalid credentials!", page: "login" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userExist[0].password
      );

      if (!isPasswordValid) {
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
