import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/init.js";
import { compare } from "bcrypt";
const { ACCESS_TOKEN_SECRET: accessTokenSecret } = process.env;
const router = Router();

router.get("/", (_req, res) =>
  res.render("index", { page: "index", redirect: "/" })
);

router.post("/", async (req, res) => {
  const { password }: { password?: string } = req.body;
  const { redirect }: { redirect?: string } = req.query;

  const finalPage = redirect || "next";
  if (!password?.trim()) {
    return res.status(400).render("index", {
      error: "Mot de passe manquant",
      page: "index",
      redirect: req.originalUrl !== "/" ? "/?redirect=" + finalPage : "/",
    });
  }

  db.get("SELECT password FROM users LIMIT 1;", async function (err, row) {
    if (err) {
      return res.status(500).render("index", {
        page: "index",
        error: err.message,
      });
    }
    const _row = row as { password: string | undefined };
    if (_row && (await compare(password, _row.password || ""))) {
      const user = { name: "admin" };
      const accessToken = jwt.sign(user, accessTokenSecret!);
      res = res.header("Authorization", "Bearer " + accessToken);
      res.cookie("wftk", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 300_000), // Cookie expires after 5 minutes
      });
      return res.redirect(finalPage);
    } else {
      return res.render("index", {
        page: "index",
        error: "Mot de passe incorrect",
        redirect: (req.originalUrl !== '/') ? "/?redirect=" + finalPage : "/",
      });
    }
  });
});

export default router;
