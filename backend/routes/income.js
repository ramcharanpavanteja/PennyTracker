import express from "express";
import { addIncome, getAllIncome, deleteIncome, downloadIncome } from "../controllers/incomeController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();
router.post("/addIncome",protect,addIncome);
router.get("/getIncome",protect,getAllIncome);
router.delete("/:id",protect,deleteIncome);
router.get("/getDownloadExcel",protect,downloadIncome);


export default router;
