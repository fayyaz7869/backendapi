import User from "../models/User.model.js";

export const verifyNGOCreator = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'ngoCreator') {
      return res.status(404).json({ message: 'Invalid NGO Creator' });
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: 'NGO Creator verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApprovedByAdmin = true;
    await user.save();

    res.status(200).json({ message: `${user.role} approved successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApprovedByAdmin: false }).select('-password');
    res.status(200).json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending users", error: err.message });
  }
};
