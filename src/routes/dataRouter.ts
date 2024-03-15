import { Router } from "express";
import { db } from "../db/init.js";
const router = Router();

router.get("/", async (_req, res) => {
  db.all("SELECT * FROM gestion_de_stock", function (err, rows) {
    if (err) return;
    const _rows: any[] = rows;
    const _rr = _rows.map((r) => {
      return {
        id: r.id,
        date: new Date(r.date).toLocaleDateString("en-UK"),
        restes: r.restes,
        achats: r.achats,
        ventes: r.ventes,
        dette: r.dette,
        stocks: r.produits,
        produits: r.produits,
      };
    });
    const output = _rr?.sort((a, b) => {
      const _a = a.date.split("/");
      const _b = b.date.split("/");

      const [year_a, month_a, day_a] = _a;
      const [year_b, month_b, day_b] = _b;

      return (parseInt(year_a) - parseInt(year_b) ||
        (parseInt(year_a) === parseInt(year_b) &&
          parseInt(month_a) - parseInt(month_b)) ||
        (parseInt(year_a) === parseInt(year_b) &&
          parseInt(month_a) === parseInt(month_b) &&
          parseInt(day_a) - parseInt(day_b))) as number;
    });
    res.json(output);
  });
});

export default router;
