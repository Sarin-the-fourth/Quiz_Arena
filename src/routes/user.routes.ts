import { Router } from "express";
import { requireUser } from "../middleware/auth.middleware";
import { getMe, getOneUser } from "../controller/user.controller";

const router = Router();
router.get("/me", requireUser, getMe);
router.get("/:userId", getOneUser);

export default router;
