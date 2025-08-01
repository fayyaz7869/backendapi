import Campaign from "../models/Campaign.model.js";
import multer from "multer";

export const createCampaign = async (req, res) => {
  try {
    const { title, description, email, address, location, date } = req.body;

    if (!title || !description || !email || !address || !location || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const imagePath = req.file ? `uploads/${req.file.filename}` : "";

    const newCampaign = new Campaign({
      title,
      description,
      email,
      address,
      location,
      date,
      image: imagePath,
      creator: req.user._id,
    });

    await newCampaign.save();

    res.status(201).json({ message: "Campaign created", campaign: newCampaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create campaign" });
  }
};




export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, creator: req.user.id });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("creator", "name email");
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user.id });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
