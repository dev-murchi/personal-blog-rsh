import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { CustomError } from "../models/custom-error";
import { userService } from "../service/user.service";

export async function authanticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.signedCookies["mt"];
    if (!token) {
      throw new CustomError("Page not found", 404);
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await userService.findUser(decoded["email"]);

    if (user.length === 0) {
      return next(new CustomError("Authentication Invalid", 401));
    }

    (req as any).user = {
      mail: user[0].email,
      role: user[0].role,
    };

    next();
  } catch (error) {
    return next(error);
  }
}

export function authorizeUser(req: Request, res: Response, next: NextFunction) {
  const { user } = req as any;

  if (user.role !== "admin") {
    return next(new CustomError("Unauthorized", 403));
  }
  next();
}
