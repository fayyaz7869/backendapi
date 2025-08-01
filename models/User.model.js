// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 50,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     maxlength: 100,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,      // Strong passwords only
//     maxlength: 1024,   // After bcrypt hashing
//   },
//   role: {
//     type: String,
//     enum: ["admin", "ngoCreator", "volunteer", "user"],
//     default: "user",
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false,
//   },
// }, {
//   timestamps: true,
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    select: false, // ✅ Hide password by default in queries
  },
  role: {
    type: String,
    enum: ["admin", "ngoCreator", "volunteer", "user"],
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Avoid rehashing on update
  this.password = await bcrypt.hash(this.password, 10); // 10 rounds salt
  next();
});

export default mongoose.model("User", userSchema);
