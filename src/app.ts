import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { logger } from "./loggingService.js";
import express, { json, urlencoded } from "express";

import nextRouter from "./routes/nextRouter.js";
import resetRouter from "./routes/resetRouter.js";
import doneeRouter from "./routes/doneeRouter.js";
import dataRouter from "./routes/dataRouter.js";
import indexRouter from "./routes/indexRouter.js";
import monthlyDataRouter from "./routes/monthlyDataRouter.js";
import { port } from "./config.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(urlencoded({ extended: true }));
app.use(json());

// static files
app.use(express.static(join(__dirname, "public")));
// Routes
app.use("/", indexRouter);
app.use("/next", nextRouter);
app.use("/reset", resetRouter);
app.use("/donee", doneeRouter);
app.use("/data", dataRouter);
app.use("/monthlydata", monthlyDataRouter);

// Handle 404
app.use((_req, res) => res.status(404).render("404", { page: "404" }));

const server = app.listen(port || 3000, () =>
  logger.log("listening on port http://localhost:" + port || 3000)
);
