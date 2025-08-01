import express from "express";
import { getAllCampaigns, login, register, verifyEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail); 
router.post("/login",login)
router.get("/campaigns",getAllCampaigns);

export default router;
