import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import path from "node:path";

import { homePageRouter } from "./router/home-page.router";
import { adminRouter } from "./router/admin.router";
import { articleRouter } from "./router/article.router";
import { authRouter } from "./router/auth.router";
import { notFound } from "./middleware/not-found.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import cookieParser from "cookie-parser";

if (!process.env.SSL_KEY || !process.env.SSL_CERT || !process.env.JWT_SECRET) {
  console.error("Missing Certificates");
  process.exit(1);
}

const options = {
  key: readFileSync(process.env.SSL_KEY),
  cert: readFileSync(process.env.SSL_CERT),
};

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/", homePageRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/article", articleRouter);

app.use(notFound);
app.use(errorHandler);

createServer(options, app).listen(PORT, () =>
  console.log(`Listening on port: ${PORT}`)
);
