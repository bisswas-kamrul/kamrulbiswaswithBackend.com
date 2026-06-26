const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://kamrulbiswas-com.vercel.app",
      "https://kamrulbiswaswithbackend-com.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      //   auth: {
      //     user: "kamrulnahid01710294440@gmail.com",
      //     pass: "asdaewwlvajpeczj",
      //   },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Portfolio Contact Form" <kamrulnahid01710294440@gmail.com>',
      to: "bisswaskamruldev@gmail.com",
      subject: `Portfolio Message from ${name}`,
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    // Auto-reply mail to customer
    await transporter.sendMail({
      from: '"Kamrul Biswas" <kamrulnahid01710294440@gmail.com>',
      to: email,
      subject: "Thank you for contacting me",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting me through my portfolio website.</p>
        <p>I have received your message and will get back to you as soon as possible.</p>

        <br>

        <p>Best Regards,</p>
        <p><b>Kamrul Biswas</b></p>
        <p>MERN Stack Developer</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
