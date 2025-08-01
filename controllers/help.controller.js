import Help from "../models/Help.model.js";
import Campaign from "../models/Campaign.model.js"
import nodemailer from "nodemailer";
// export const submitHelpRequest = async (req, res) => {
//   try {
//     const { name, contact, email, address, campaing_name ,problem } = req.body;

//     const helpEntry = new Help({ name, contact, email, address , campaing_name ,problem });
//     await helpEntry.save();

//     res.status(201).json({ message: "Help request submitted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


export const submitHelpRequest = async (req, res) => {
  try {
    const { name, contact, email, address, campaing_name, problem } = req.body;

    const campaign = await Campaign.findOne({ title: campaing_name }).populate("creator");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const helpEntry = new Help({
      name,
      contact,
      email,
      address,
      campaing_name: campaign._id, 
      problem,
    });

    await helpEntry.save();

    const creatorEmail = campaign.creator.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: creatorEmail,
      subject: `New Help Request for ${campaing_name}`,
      text: `
        A new help request has been submitted:
        Name: ${name}
        Contact: ${contact}
        Email: ${email}
        Address: ${address}
        Problem: ${problem}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Help request submitted and email sent successfully" });
  } catch (err) {
    console.error("Help request error:", err);
    res.status(500).json({ error: err.message });
  }
};

