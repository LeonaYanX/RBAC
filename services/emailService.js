// backend/services/emailService.js
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // хост SMTP-сервера
  port: +process.env.SMTP_PORT, // порт SMTP-сервера
  secure: false, // true для 465
  auth: {
    user: process.env.SMTP_USER, // логин
    pass: process.env.SMTP_PASS, // пароль
  },
});

/**
 * Отправка письма
 * @param {string} to — кому
 * @param {string} subject — тема
 * @param {string} html — HTML-контент
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
