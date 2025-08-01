import mongoose from "mongoose";

const volunteerCampaignSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  name: String,
  email: String,
  contact: String,
  address: String,
  date: String,
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("VolunteerCampaignJoin", volunteerCampaignSchema);
