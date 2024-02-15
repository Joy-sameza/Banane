import { Router } from "express";
import { hash } from "bcrypt";
import { db } from "../db/init.js";
import { logger, timeMsg } from "../loggingService.js";

const router = Router();
router.get("/", (_req, res) => res.render("reset", { page: "reset" }));

router.post("/", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hash(password, 10);
    // "INSERT INTO users (password) VALUES (?);" "UPDATE users SET password = ? WHERE id = 1;"
    db.run(
      "UPDATE users SET password = ? WHERE id = 1;",
      hashedPassword,
      function (err) {
        if (err) {
          const errorMessage = `${timeMsg}\n\tError: ${err}`;
          logger.error(errorMessage);
          res.status(500).send({ done: false });
          return;
        }
        logger.log("Password updated");
        res.status(200).send({ done: true });
      }
    );
  } catch (err) {
    const errorMessage = `${timeMsg}\n\tError: ${err}`;
    logger.error(errorMessage);
    res.status(500).send({ done: false });
  }
});

export default router;
