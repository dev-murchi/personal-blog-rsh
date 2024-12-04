import { NextFunction, Request, Response } from "express";
import { userService } from "../service/user.service";
export class AuthControler {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        res
          .status(400)
          .render("login", { error: "Please provide valid credentials!" });
      } else {
        const userExist = await userService.findUser(email);

        if (userExist.length === 1) {
          return res
            .status(400)
            .render("login", { error: "User already exists!" });
        }

        const user = await userService.saveUser({
          username,
          email,
          password,
          role: "user",
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        });

        console.log({ user: user[0] });

        res.redirect("/login");
      }
    } catch (error) {
      next(error);
    }
  }
}

export const authControler = new AuthControler();
