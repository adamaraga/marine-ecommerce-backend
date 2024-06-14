const appRoot = require("app-root-path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: "mail.newsoko.org",
  port: 465,
  secure: true, // true for 465, false for other ports
  priority: "high",
  auth: {
    user: "noreply@newsoko.org",
    pass: "b()&Z}asGOD[",
  },
});

const sendVerificationEmail = async (name, token, to) => {
  const mailData = {
    firstName: name,
    link: `${process.env.EMAIL_VERIFICATION_LINK}` + token,
  };

  const html = await ejs.renderFile(
    appRoot.path + "/src/templates/emails/emailVerification.ejs",
    mailData
  );

  const mailOptions = {
    from: `${process.env.EMAIL_ADDRESS}`,
    to: to,
    subject: "Email verification",
    html, // Use the rendered HTML from the template
  };

  transporter.sendMail(mailOptions);
};

const sendForgotPasswordEmail = async (name, token, to) => {
  const mailData = {
    firstName: name,
    link: `${process.env.FORGET_PASSWORD_LINK}` + token,
  };

  const html = await ejs.renderFile(
    appRoot.path + "/src/templates/emails/forgotPassword.ejs",
    mailData
  );

  const mailOptions = {
    from: `${process.env.EMAIL_ADDRESS}`,
    to: to,
    subject: "Forget Password",
    html, // Use the rendered HTML from the template
  };

  transporter.sendMail(mailOptions);
};

const sendMail = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
};

module.exports = sendMail;
