import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address:{type:String,required:true},
  campaing_name:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    trim: true
  },
  problem: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model("Help", helpSchema);
