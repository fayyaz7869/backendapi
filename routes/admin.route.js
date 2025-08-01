import express from "express";
import { approveUserRole, getAllUsers, getPendingUsers, verifyNGOCreator } from "../controllers/admin.controller.js";
import { protect } from "../middlewares/user.middleware.js";

const router = express.Router();
router.patch('/verify-ngo-creator', protect, verifyNGOCreator);
router.patch('/approve/:id', protect(["admin"]), approveUserRole);
router.get('/all-users', protect(["admin"]), getAllUsers);
router.get("/pending-users", protect(["admin"]), getPendingUsers);
export default router;

