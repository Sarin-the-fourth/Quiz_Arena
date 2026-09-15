import { Router } from "express";
import { requireUser } from "../middleware/auth.middleware.js";
import { getMe, getOneUser } from "../controller/user.controller.js";

const router = Router();
router.get("/me", requireUser, getMe);
router.get("/:userId", getOneUser);

export default router;
