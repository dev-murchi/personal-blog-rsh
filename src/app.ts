import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import path from "node:path";

import { indexRouter } from "./router/index.router";
import { adminRouter } from "./router/admin.router";
import { articleRouter } from "./router/article.router";
import { loginRouter } from "./router/login.router";
import { notFound } from "./middleware/not-found.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";

if (!process.env.SSL_KEY || !process.env.SSL_CERT) {
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

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/article", articleRouter);
app.use("/login", loginRouter);

app.use(notFound);
app.use(errorHandler);

createServer(options, app).listen(PORT, () =>
  console.log(`Listening on port: ${PORT}`)
);
