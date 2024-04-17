import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { join } from 'path';
import Debug from 'debug';

const debug = Debug('app:services:mail');

const filename = fileURLToPath(import.meta.url);
const dirname = join(filename, '..');
const imagePath = join(dirname, '../../../img/logo_otalent.png');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_KEY,
  },
});

/**
 * Sends a password reset email to the user associated with the provided email address.
 * @param {string} email - The email address of the user.
 * @param {string} token - The password reset token.
 */
async function sendPasswordReset(email, token) {
  try {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const otalentLink = 'https://localhost:5173';
    const text = `Hi there!<br><br>It seems that you have forgotten your password. 
To reset it, please click on the following link:<br><a href="${resetLink}">${resetLink}</a>. 
<br>If you did not request a password reset, please ignore this email.<br><br>See you soon on <a href="${otalentLink}">Otalent</a>!<br><br><img src="cid:image" alt="logo_otalent">`;

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

    await transporter.sendMail({
      from: 'otalentoclock@gmail.com',
      to: email,
      subject: 'Password Reset',
      html,
      attachments: [
        {
          filename: 'logo_otalent.png',
          path: imagePath,
          cid: 'image',
        },
      ],
    });
    return true;
  } catch (error) {
    debug(`Failed to send email: ${error}`);
    return false;
  }
}

export default { sendPasswordReset };
