import { config } from "dotenv";
config();
import sqlite from "sqlite3";
import { logger } from "../loggingService.js";
const { SQLITE_DB_PATH: sqliteDbPath } = process.env;

const sqlite3 = sqlite.verbose();

// Database creation
const db = new sqlite3.Database(
  sqliteDbPath!,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      logger.error(err.message);
    }
  }
);

//create table users
const sql = `CREATE TABLE IF NOT EXISTS users (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT, 
  "password" TEXT NOT NULL DEFAULT ""
  );`;

// create table gestion_de_stock
const sql3 = `
  CREATE TABLE IF NOT EXISTS gestion_de_stock ( 
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "date" UNSIGNED INTEGER NOT NULL UNIQUE,
    "dette" UNSIGNED INTEGER NOT NULL DEFAULT 0,
    "achats" UNSIGNED INTEGER NOT NULL DEFAULT 0,
    "produits" UNSIGNED INTEGER NOT NULL DEFAULT 0,
    "restes" UNSIGNED INTEGER NOT NULL DEFAULT 0,
    "stocks" UNSIGNED INTEGER NOT NULL DEFAULT 0,
    "ventes" UNSIGNED INTEGER NOT NULL DEFAULT 0
  );`;

// create table exprot data
const sql4 = `
CREATE TABLE IF NOT EXISTS monthly_total (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "month" INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  "year" INTEGER NOT NULL CHECK (year >= 2023),
  "achats" INTEGER NOT NULL,
  "ventes" INTEGER NOT NULL,
  "production" INTEGER NOT NULL
);
`;

const sqlQueries: string[] = [sql, sql3, sql4];

for (const sqlQuery of sqlQueries) {
  db.run(sqlQuery, (err) => {
    if (err) {
      logger.error(err.message);
    }
  });
}

export { db };
