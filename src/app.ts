import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import { createServer } from "node:https";
import path from "node:path";
import * as pageController from "./controller/page.controller";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", pageController.homePage);
app.get("/article/:id", pageController.articlePage);
app.get("/admin", pageController.adminPage);
app.get("/login", pageController.loginPage);
app.get("/new", pageController.articleCreatePage);
app.post("/new", blogController.createArticle);
app.get("/article/:id/edit", pageController.articleEditPage);
app.post("/article/:id/edit", blogController.updateArticle);

app.use((req, res, next) => {
  res.statusCode = 404;
  res.render("404");
});

createServer(options, app).listen(PORT, () =>
  console.log(`Listening on port: ${PORT}`)
);
