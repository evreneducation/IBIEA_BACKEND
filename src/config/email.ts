import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

transporter
  .verify()
  .then(() => console.log("Email server ready to send messages"))
  .catch((error) => {
    console.log("Email verification error: ", error);
    process.exit(1);
  });
