import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import path from "node:path";
import * as blogController from "./controller/blog.controller";

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
app.use(express.urlencoded({ extended: true }));

app.get("/", blogController.homePage);
app.get("/article/:id", blogController.singleArticle);

app.use((req, res, next) => {
  res.statusCode = 404;
  res.render("404");
});

createServer(options, app).listen(PORT, () =>
  console.log(`Listening on port: ${PORT}`)
);
