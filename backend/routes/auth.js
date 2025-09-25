import express from "express";
import {registerUser,loginUser,me} from "../controllers/authController.js";
import {protect} from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import User from "../models/Users.js";
import { uploadProfileImage } from "../controllers/userController.js";
import {updatemonthlyBudget,getMonthlyBudget} from "../controllers/budgetController.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",protect,me);
router.put("/budget",protect,updatemonthlyBudget);
router.get("/budget",protect,getMonthlyBudget);
router.put("/profile-image", protect, upload.single("image"), uploadProfileImage);

router.get("/profile-image/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.profileImage.data) {
      return res.status(404).send("No image found");
    }

    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;