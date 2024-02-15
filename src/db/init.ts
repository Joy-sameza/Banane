import { config } from "dotenv";
config();
import sqlite from "sqlite3";
const { SQLITE_DB_PATH: sqliteDbPath } = process.env;

const sqlite3 = sqlite.verbose();

const db = new sqlite3.Database(
  sqliteDbPath!,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

//create table users
const sql =
  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, password TEXT NOT NULL DEFAULT "")';
db.run(sql, (err) => {
  if (err) {
    console.error(err.message);
  }
});

// create table gestion_de_stock
const sql3 =
  'CREATE TABLE IF NOT EXISTS gestion_de_stock ( "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "date" DATE NOT NULL DEFAULT CURRENT_DATE, "dette" INTEGER NOT NULL DEFAULT 0, "achats" INTEGER NOT NULL DEFAULT 0, "produits" INTEGER NOT NULL DEFAULT 0, "restes" INTEGER NOT NULL DEFAULT 0, "stocks" INTEGER NOT NULL DEFAULT 0, "ventes" INTEGER NOT NULL DEFAULT 0);';

db.run(sql3, (err) => {
  if (err) {
    console.error(err.message);
  }
});

export { db };
