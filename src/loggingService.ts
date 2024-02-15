import { createWriteStream } from "fs";
import { Console } from "console";
import { config } from "dotenv";
const output = createWriteStream("logs/stdout.log");
const errorOutput = createWriteStream("logs/stderr.log");
config();
// Custom simple logger

const logger =
  process.env.NODE_ENV === "production"
    ? new Console({ stdout: output, stderr: errorOutput })
    : console;
const currentDate = new Date();
const timeMsg = currentDate.toLocaleString("fr-CM", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
export { logger, timeMsg };
