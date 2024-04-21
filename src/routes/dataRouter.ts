import { Router } from "express";
import { db } from "../db/init.js";
import authenticateToken from "../auth/auth.js";
import { DataModel } from "../models/index.js";
const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  const { year, month }: { year?: string; month?: string } = req.query;
  db.all("SELECT * FROM gestion_de_stock", function (err, rows) {
    if (err) return;
    const _rows: any[] = rows;
    const _rr = _rows.map<DataModel>((r) => {
      return {
        id: r.id,
        date: unformatDate(Number(r.date)).toLocaleDateString("en-UK"),
        restes: r.restes,
        achats: r.achats,
        ventes: r.ventes,
        dette: r.dette,
        stocks: r.stocks,
        produits: r.produits,
      };
    });
    let toBeSorted = _rr;
    if (year) {
      toBeSorted = toBeSorted.filter(
        (r) => Number(r.date.split("/")[2]) === Number(year)
      );
    }
    if (month) {
      toBeSorted = toBeSorted.filter(
        (r) => Number(r.date.split("/")[1]) === Number(month)
      );
    }

    const output = toBeSorted?.sort((a, b) => {
      const aDate = a.date.split("/").map(Number);
      const bDate = b.date.split("/").map(Number);
      return aDate[2] - bDate[2] || aDate[1] - bDate[1] || aDate[0] - bDate[0];
    });

    res.json(output);
  });
});

export default router;

function unformatDate(date: number): Date {
  return new Date(date * 1000);
}
