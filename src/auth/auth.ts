import jwt from "jsonwebtoken";
import { config } from "dotenv";
import cookie from "cookie";
import express from "express";
config();

const { ACCESS_TOKEN_SECRET: accessTokenSecret } = process.env;

// middleware
function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const originalUrl = req.originalUrl !== "/data" ? req.originalUrl : null;
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies?.wftk;

  if (!token) {
    return res.status(401).render("index", {
      error: "Veuillez vous connecter",
      page: "index",
      redirect:
        originalUrl !== null ? `/?redirect=${originalUrl.split("/").at(-1)}` : "/",
    });
  }
  jwt.verify(token, accessTokenSecret!, function (err) {
    if (err) {
      return res.status(403).render("index", {
        error: "Veuillez vous connecter",
        page: "index",
        redirect: originalUrl !== null ? `/?redirect=${originalUrl.split("/").at(-1)}` : "/",
      });
    }
    next();
  });
}

export default authenticateToken;
