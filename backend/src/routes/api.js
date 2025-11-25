import express from "express";
import {
  generateRoutine,
  getHistory,
  getStats,
  voteRoutine,
} from "../controllers/routineController.js";

const router = express.Router();

// Definimos las rutas
router.get("/history", getHistory);
router.get("/stats", getStats);
router.post("/recommend", generateRoutine);
router.post("/vote", voteRoutine);

export default router;
