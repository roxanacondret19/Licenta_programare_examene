const nodemailer =  require("nodemailer");
const { config } = require("../config/config");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

const SENDMAIL = async (mailDetails, ) => {
  try {
    await transporter.sendMail(mailDetails)
  } catch (error) {
    console.log(error);
  }
};

module.exports = SENDMAIL;