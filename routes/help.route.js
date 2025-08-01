import express from "express";
import { submitHelpRequest } from "../controllers/help.controller.js";
const router = express.Router();

router.post("/", submitHelpRequest);

export default router;
