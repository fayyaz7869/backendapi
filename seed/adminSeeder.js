import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  try {
    const admin = await User.findOne({ email: "fayyazmansoori256@gmail.com" });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("Serve@420", 10);

      await User.create({
        name: "Fayyaz Mansoori",
        email: "fayyazmansoori256@gmail.com",
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
        isApprovedByAdmin: true,
      });

      console.log("Default admin created");
    } else {
      console.log(" Admin already exists");
    }
    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
