
import express from "express";
import { protect } from "../middlewares/user.middleware.js";
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getMyCampaigns
} from "../controllers/campaign.controller.js";
import multer from "multer";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', getAllCampaigns);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
router.use(protect(["ngoCreator"]));
router.post('/',isAuthenticated,upload.single("image"), createCampaign);
router.get('/all', getMyCampaigns);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

export default router;
