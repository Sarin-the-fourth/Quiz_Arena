import { Router } from "express";
import {
  createGame,
  getGame,
  getOneGame,
  joinGame,
  leaveGame,
  startGame,
} from "../controller/game.controller";
import { requireUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireUser, createGame);
router.post("/join", requireUser, joinGame);
router.get("/", getGame);

// routes using params
router.patch("/:roomCode/leave", requireUser, leaveGame);
router.get("/:roomCode", getOneGame);
router.patch("/:roomCode/start", requireUser, startGame);

export default router;
