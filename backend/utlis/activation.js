const nodemailer = require("nodemailer");

const ActivationMail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP host (e.g., smtp.gmail.com)
    port: process.env.SMTP_PORT, // SMTP port (587 is for STARTTLS)
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL, // Your email address
      pass: process.env.SMTP_PASS,  // Your app password from Gmail
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html: message,
  });
};

module.exports = ActivationMail;