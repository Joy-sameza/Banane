import { Router } from "express";
import authenticateToken from "../auth/auth.js";
import { logger, timeMsg } from "../loggingService.js";
import { db } from "../db/init.js";
const router = Router();

type lastRowDataType = object & { restes: number };
type IcomminData = { [key: string]: string | null | undefined };

router.get("/", authenticateToken, (_req, res) => {
  res.render("next", { page: "next" });
});

router.post("/", authenticateToken, (req, res) => {
  const { date, achats, produits, ventes, dette }: IcomminData = req.body;

  const query = `
    SELECT 
      id,
      MAX(date) as date,
      restes
    FROM gestion_de_stock
    `;

  try {
    db.all(query, (err, rows) => {
      if (err) throw err;
      const index = rows?.length - 1;
      const lastRow: any = rows && rows[index < 0 ? 0 : index];

      console.log({ rows });

      //verify if data already exist
      if (!lastRow && lastRow.date != date) {
        res.render("next", {
          error: "Donné existant",
          achats,
          produits,
          ventes,
          page: "next",
        });
        return;
      }

      if (!date) {
        res.render("next", {
          error: "Veuillez renseigner une date",
          achats,
          produits,
          ventes,
          page: "next",
        });
        return;
      }

      saveData(
        lastRow,
        produits || "0",
        ventes || "0",
        formatDate(date),
        dette || "0",
        achats || "0"
      );
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
      achats,
      produits,
      ventes,
      page: "next",
    });
  }

  // // Auto add and calculate data in monthly_total table in database

  // try {
  //   const sql = `
  //     SELECT
  //       SUM(restes) as restes,
  //       SUM(produits) as produits,
  //       SUM(ventes) as ventes,
  //       SUM(dette) as dette,
  //       SUM(achats) as achats
  //     FROM gestion_de_stock
  //     WHERE "date" <= "${sqlDate}"
  //   `;
  //   const _query = `SELECT
  //     SUM(restes) as restes,
  //     SUM(produits) as produits,
  //     SUM(ventes) as ventes,
  //     SUM(dette) as dette,
  //     SUM(achats) as achats
  //   FROM gestion_de_stock
  //   WHERE
  //     substr("date", 1, 4) = ${year} AND
  //     substr("date", 6, 2) >= ${month} AND
  //     substr("date", 9, 2) >= ${day}`;
  //     const newData = Object.fromEntries<string>([]);

  // } catch (error) {

  // }
});

/**
 * Save data to the database
 * @throws error if any occured
 */
function saveData(
  lastRow: lastRowDataType,
  produits: string,
  ventes: string,
  date: number,
  dette: string,
  achats: string
) {
  const lastRest = lastRow?.restes ?? 0;
  const stock = parseInt(produits ?? 0) + parseInt(`${lastRest ?? 0}`);
  const restes =
    stock - parseInt(ventes ?? 0) <= 0 ? 0 : stock - parseInt(ventes ?? 0);
  const query =
    "INSERT or REPLACE INTO gestion_de_stock (date, dette, achats, produits, restes, stocks, ventes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.run(
    query,
    [
      `${date}`,
      dette ?? 0,
      achats ?? 0,
      produits ?? 0,
      restes,
      stock,
      ventes ?? 0,
    ],
    (error) => {
      if (error) {
        logger.error(
          JSON.stringify({
            name: error.name,
            cause: error.cause,
            message: error.message,
            stack: error.stack,
          })
        );
        throw error;
      }
    }
  );
}

/**
 * Formats the given date string to seconds since epoch.
 *
 * @param {string} date - The date string to be formatted.
 * @return {number} The formatted date in seconds since epoch.
 */
function formatDate(date: string): number {
  const d = new Date(date).getTime() / 1000;
  return Math.floor(d);
}


export default router;
