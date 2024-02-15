import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/init.js";
import { compare } from "bcrypt";
const { ACCESS_TOKEN_SECRET: accessTokenSecret } = process.env;
const router = Router();

router.get("/", (_req, res) => res.render("index", { page: "index" }));

router.post("/", async (req, res) => {
  const { password }: { password?: string } = req.body;

  if (!password?.trim()) {
    return res.status(400).render("index", {
      error: "Mot de passe manquant",
      page: "index",
    });
  }

  db.get("SELECT password FROM users LIMIT 1;", async function (err, row) {
    if (err) {
      return res.render("index", {
        page: "index",
        error: err.message,
      });
    }
    const _row: any = row;
    if (_row && (await compare(password, _row.password || ""))) {
      const user = { name: "admin" };
      const accessToken = jwt.sign(user, accessTokenSecret!);
      res = res.setHeader("Authorization", "Bearer " + accessToken);
      res.cookie("wftk", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 300_000),
      });
      return res.render("next", { page: "next" });
    } else {
      return res.render("index", {
        page: "index",
        error: "Mot de passe incorrect",
      });
    }
  });
});

export default router;
