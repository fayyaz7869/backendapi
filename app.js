import express from "express";
import path from 'path';
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import helpRoutes from "./routes/help.route.js";
import mongoose from "mongoose";
import contactRoutes from './routes/contact.route.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-serveconnect.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/contact",contactRoutes);
app.use("/help", helpRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to ServeConnect API");
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("database  connectted successfully");
  console.log("__dirname:", __dirname);


app.listen(PORT, () => {
  console.log(`Server is running on https://backendapi-gfwk.onrender.com`);
});
}).catch(error => {
  console.log("Database connection failed:",error);
});
