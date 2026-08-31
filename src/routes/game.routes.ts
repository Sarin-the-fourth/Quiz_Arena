import { Router } from "express";
import {
  createGame,
  getGame,
  getOneGame,
  joinGame,
  startGame,
} from "../controller/game.controller";
import { requireUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireUser, createGame);
router.post("/join", requireUser, joinGame);
router.get("/", getGame);

// routes using params
router.get("/:gameId", getOneGame);
router.patch("/:gameId/start", requireUser, startGame);

export default router;
