import { Router } from "express";
import authenticateToken from "../auth/auth.js";
import fetch from "node-fetch";
const router = Router();

router.get("/", authenticateToken, async function (req, res) {
  const response = await fetch("http://localhost/data", {
    headers: { Cookie: req.headers.cookie || "" },
  });
  const data = (await response.json()) as any[];
  return res.render("donee", { page: "donee", data });
});

export default router;
