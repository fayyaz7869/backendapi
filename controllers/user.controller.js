import User from "../models/User.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Campaign from "../models/Campaign.model.js";
import dotenv from "dotenv";
dotenv.config();


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });

    const token = generateToken(email);
    await sendEmail(email, name, token);

    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

const sendEmail = async (email, name, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const verifyUrl = `https://backendapi-gfwk.onrender.com/user/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to ServeConnect - Verify your Email',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering. Please verify your email:</p>
      <a href="${verifyUrl}" style="background-color:blue;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Verify Email
      </a>
      <p>If you did not register, please ignore this.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const generateToken = (email) => {
  const payload = { email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};




export const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const result = await User.updateOne({ email }, { $set: { isEmailVerified: true } });

    return res.status(200).send(`
      <h2>Email verified successfully ✅</h2>
      <p>You can now close this tab and log in.</p>
    `);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).send("Verification failed. Link expired or invalid.");
  }
};



export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
      return res.status(404).json({ message: 'User not found with this role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Your account is not verified yet. Please wait for admin approval.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "Lax", 
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .status(200)
      .json({ message: "Login successful", user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};






export const getAllCampaigns = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query = { $or: [{ title: regex }, { description: regex }] };
    }

    const campaigns = await Campaign.find(query).populate("creator", "name email");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};