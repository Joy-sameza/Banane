import { createWriteStream } from "fs";
import { Console } from "console";
import { NODE_ENV } from "./config.js";
const output = createWriteStream("logs/standard_output.log");
const errorOutput = createWriteStream("logs/standard_error.log");
// Custom simple logger

const logger =
  NODE_ENV === "production"
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
