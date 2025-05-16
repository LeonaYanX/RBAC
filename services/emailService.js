// backend/services/emailService.js
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // host of SMTP-server
  port: +process.env.SMTP_PORT, // port of SMTP-server
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // login
    pass: process.env.SMTP_PASS, // password
  },
});

/**
 * Отправка письма
 * @param {string} to — to address
 * @param {string} subject — title
 * @param {string} html — HTML content
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
