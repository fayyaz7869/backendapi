import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    location: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,  
      required: false
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Campaign", campaignSchema);
