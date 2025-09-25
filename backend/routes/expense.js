import express from "express";
import { addExpense, getAllExpense, deleteExpense, downloadExpense } from "../controllers/expenseController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();
router.post("/addExpense",protect,addExpense);
router.get("/getExpense",protect,getAllExpense);
router.delete("/:id",protect,deleteExpense);
router.get("/getDownloadExcel",protect,downloadExpense);
export default router;
