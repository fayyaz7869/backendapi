import VolunteerJoin from "../models/Volunteer.model.js";
import Campaign from "../models/Campaign.model.js";
import nodemailer from "nodemailer";

export const joinCampaign = async (req, res) => {
  try {
    const { campaignId, volunteerId, name, email, contact, address, date } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const joinEntry = await VolunteerJoin.create({
      volunteerId, campaignId, name, email, contact, address, date
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
      }
    });

    const verificationLink = `http://localhost:5173/verify/${joinEntry._id}`;
    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: campaign.email,
      subject: "Volunteer Join Request",
      html: `
        <p>${name} wants to join your campaign.</p>
        <p>Click below to approve:</p>
        <a href="${verificationLink}">Approve Volunteer</a>
      `
    });

    res.status(201).json({ message: "Request sent for approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
    await VolunteerJoin.findByIdAndUpdate(id, { verified: true });
    res.send("Volunteer approved successfully.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCampaigns = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const campaigns = await VolunteerJoin.find({ volunteerId, verified: true }).populate("campaignId");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const withdrawFromCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    await VolunteerJoin.findByIdAndDelete(id);
    res.json({ message: "Withdrawn from campaign" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
