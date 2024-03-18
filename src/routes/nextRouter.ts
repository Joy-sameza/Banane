import { Router } from "express";
import authenticateToken from "../auth/auth.js";
import { logger, timeMsg } from "../loggingService.js";
import { db } from "../db/init.js";
const router = Router();

type lastRowDataType = object & { restes: number };

router.get("/", authenticateToken, (_req, res) => {
  res.render("next", { page: "next" });
});

router.post("/", authenticateToken, (req, res) => {
  const { date, achats, produits, ventes, dette } = req.body;
  let [year, month, day] = date.split("-") as [string, string, string];

  const normalDate: [string, string, string] = [day, month, year];
  let sqlDate = date; //`${day}/${month}/${year}`;
  let query = `SELECT id, MAX("date") as latest_date, restes FROM gestion_de_stock WHERE "date" < '${sqlDate}'`;
  if (parseInt(day) === 1) {
    let _month = parseInt(month) - 1;
    if (_month == 0) {
      _month = 12;
      year = (parseInt(year) - 1).toString();
    }
    month = _month.toString();
    let numberOFDAys = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (_month == 2 && parseInt(year) % 4 == 0) {
      numberOFDAys[1] = 29;
    }
    day = numberOFDAys[_month - 1].toString();
    sqlDate = `${day}/${month}/${year}`;
    query = `SELECT id, max(date) as date, restes FROM gestion_de_stock where  "date" <= "${sqlDate}"`;
  }

  try {
    db.all(query, (err, rows) => {
      if (err) throw err;
      const index = rows.length - 1;
      const lastRow: any = rows[index < 0 ? 0 : index];

      saveData(lastRow, produits, ventes, ...normalDate, dette, achats);
      const msg = "Donné enregistré avec succès";
      res.render("next", {
        success: msg,
        page: "next",
      });
      logger.log(`${timeMsg}\n\t${msg}`);
      return;
    });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return res.render("next", {
      error: "Erreur d'enregistrement",
      year,
      month,
      day,
      achats,
      produits,
      ventes,
      page: "next",
    });
  }

  // Auto add and calculate data in monthly_total table in database

  try {
    const sql = `
      SELECT 
        SUM(restes) as restes, 
        SUM(produits) as produits, 
        SUM(ventes) as ventes, 
        SUM(dette) as dette, 
        SUM(achats) as achats 
      FROM gestion_de_stock 
      WHERE "date" <= "${sqlDate}"
    `;
    const _query = `SELECT 
      SUM(restes) as restes,
      SUM(produits) as produits,
      SUM(ventes) as ventes,
      SUM(dette) as dette,
      SUM(achats) as achats
    FROM gestion_de_stock 
    WHERE 
      substr("date", 1, 4) = ${year} AND 
      substr("date", 6, 2) >= ${month} AND 
      substr("date", 9, 2) >= ${day}`;
      const newData = Object.fromEntries<string>([]);

  } catch (error) {
    
  }

});

/**
 * Save data to the database
 * @throws error if any occured
 */
function saveData(
  lastRow: lastRowDataType,
  produits: string,
  ventes: string,
  day: string,
  month: string,
  year: string,
  dette: string,
  achats: string
) {
  const lastRest = lastRow?.restes ?? 0;
  const stock = parseInt(produits ?? 0) + parseInt(`${lastRest ?? 0}`);
  const restes =
    stock - parseInt(ventes ?? 0) < 0 ? 0 : stock - parseInt(ventes ?? 0);
  const query =
    "INSERT INTO gestion_de_stock (date, dette, achats, produits, restes, stocks, ventes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.run(
    query,
    [
      `${year}-${month}-${day}`,
      dette ?? 0,
      achats ?? 0,
      produits ?? 0,
      restes,
      stock,
      ventes ?? 0,
    ],
    (error) => {
      if (error) {
        logger.error(`${timeMsg}\n\t${error.message} | ${error.stack}`);
        throw error;
      }
    }
  );
}

export default router;
