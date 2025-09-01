import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

  
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, 
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };


    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
};
