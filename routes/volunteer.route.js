import express from "express";
import {joinCampaign ,verifyJoinRequest ,getMyCampaigns,withdrawFromCampaign} from "../controllers/volunteer.controller.js"

const router = express.Router();

router.post("/join", joinCampaign);
router.get("/verify/:id", verifyJoinRequest);
router.get("/my-campaigns/:volunteerId", getMyCampaigns);
router.delete("/withdraw/:id", withdrawFromCampaign);

export default router;
