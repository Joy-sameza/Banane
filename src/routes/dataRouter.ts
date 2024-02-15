import { Router } from "express";
import { db } from "../db/init.js";
const router = Router();

router.get("/", async (_req, res) => {
  db.all("SELECT * FROM gestion_de_stock", function (err, rows) {
    if (err) return;
    const _rows: any[] = rows;
    const output = _rows?.sort((a, b) => {
      return (a.year - b.year ||
        (a.year === b.year && a.month - b.month) ||
        (a.year === b.year && a.month === b.month && a.day - b.day)) as number;
    });
    res.json(output);
  });
});

export default router;
