import { config } from "dotenv";

config();
const {
  ACCESS_TOKEN_SECRET: accessTokenSecret,
  SQLITE_DB_PATH: SQLiteDBPath,
  NODE_ENV: NODE_ENV,
  PORT: port,
  APP_URL: appURL,
} = process.env;

export { SQLiteDBPath, port, accessTokenSecret, NODE_ENV, appURL };
