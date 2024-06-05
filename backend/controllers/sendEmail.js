const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // use your email service
  auth: {
    user: 'shouttolearn@gmail.com',
    pass: 'kthimictmdwgbvdo',
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'shouttolearn@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
