import { Router } from "express";
import { db } from "../db/init.js";

const router = Router();

type RowType = {
  id: number;
  date: string;
  restes: number;
  achats: number;
  ventes: number;
  dette: number;
  stocks: number;
  produits: number;
};

type dataMapType = {
  [key: string]: {
    achats: number;
    ventes: number;
    produits: number;
    dette: number;
    restes: number;
  };
};

type finalDataType = {
  achats: number;
  ventes: number;
  produits: number;
  dette: number;
  restes: number;
};

router.get("/", (_req, res) => {
  db.all("SELECT * FROM gestion_de_stock", function (err, rows) {
    if (err) return [];
    const _rows = rows as RowType[];

    const years = new Set<number>();
    const months = new Set<number>();

    for (const row of _rows) {
      const [year, month] = row.date.split("-");
      years.add(parseInt(year));
      months.add(parseInt(month));
    }

    const dataMap: dataMapType = {};

    for (const yy of years) {
      for (const mm of months) {
        const result = _rows.reduce(
          (previousValue, currentValue) => {
            if (
              yy === parseInt(currentValue.date.split("-")[0]) &&
              mm === parseInt(currentValue.date.split("-")[1])
            ) {
              return {
                achats: previousValue.achats + currentValue.achats,
                ventes: previousValue.ventes + currentValue.ventes,
                produits: previousValue.produits + currentValue.produits,
                dette: previousValue.dette + currentValue.dette,
                restes: previousValue.restes + currentValue.restes,
              };
            } else {
              return previousValue;
            }
          },
          {
            achats: 0,
            ventes: 0,
            produits: 0,
            dette: 0,
            restes: 0,
          }
        );
        const date = `${yy}-${mm}`;
        dataMap[date] = result;
      }
    }
    const finalData: { [key: string]: { [key: string]: finalDataType } }[] = [];
    for (const yy of years) {
      const thisYearData = Object.entries(dataMap).filter(([key]) => {
        return (
          new Date(yy.toString()).getFullYear() === new Date(key).getFullYear()
        );
      });
      const x = Object.fromEntries(thisYearData);
      const v = Object.fromEntries([[yy, x]]);
      finalData.push(v);
    }

    const z: { [k: string]: any } = {};

    for (const rr of finalData) {
      Object.entries(rr).forEach(([key, value]) => {
        z[key] = value;
      });
    }

    res.json([]);
  });
});

export default router;
