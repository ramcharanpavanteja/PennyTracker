import express from "express";
import {protect} from "../middleware/auth.js";
import { getDashBoardData,getRecentTransactions } from "../controllers/dashBoardController.js";

const router = express.Router();
router.get('/',protect,getDashBoardData);
router.get("/recent", protect, getRecentTransactions);

export default router;

