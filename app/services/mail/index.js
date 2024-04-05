import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_KEY,
  },
});

async function sendPasswordReset(email, token) {
  try {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const otalentLink = 'https://localhost:5173';

    const text = `Hi there!<br><br>It seems that you have forgotten your password. 
To reset it, please click on the following link:<br><a href="${resetLink}">${resetLink}</a>. 
<br>If you did not request a password reset, please ignore this email.<br><br>See you soon on <a href="${otalentLink}">Otalent</a>!`;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Password Reset</title>
</head>
<body>
${text}
</body>
</html>
`;
    const info = await transporter.sendMail({
      from: 'otalentoclock@gmail.com',
      to: email,
      subject: 'Password Reset',
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default { sendPasswordReset };
