import { Router } from "express";
import authenticateToken from "../auth/auth.js";
import fetch from "node-fetch";
import { appURL } from "../config.js";
const router = Router();

router.get("/", authenticateToken, async function (req, res) {
  const { query }: { query?: string } = req.query;
  const response = await fetch(appURL + "/monthlydata", {
    headers: { Cookie: req.headers.cookie || "" },
  });
  const data = (await response.json()) as object;

  if (query) {
    const regex = /^(\d{4})-?(\d{1,2})$/;
    const isValid = regex.test(query);
    if (!isValid) return res.status(404).render("404", { page: "404" });
    const [year, month] = query.split("-");
    const queryURL = `${appURL}/data?year=${year}&month=${month}`;
    const mResponse = await fetch(queryURL, {
      headers: { Cookie: req.headers.cookie || "" },
    });
    const mData = (await mResponse.json()) as object[];
    return res.render("cardDetail", {
      page: "Detaille",
      data: mData,
      date: query,
    });
  }

  return res.render("donee", { page: "donee", data });
});

export default router;
