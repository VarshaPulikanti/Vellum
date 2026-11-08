import { Router } from "express";
import { runAi } from "../controllers/aiController.js";

const router = Router();
router.post("/", runAi);

export default router;
