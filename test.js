import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    // user: 'otalentoclock@gmail.com',
    pass: process.env.NODEMAILER_KEY,
    // pass: 'Otalent2024.oclock',
  },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: 'otalentoclock@gmail.com',
      to: 'william.commandeur@gmail.com',
      subject: 'Est ce que ca marche',
      text: 'Bien sûr !',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
}

console.log(transporter.auth);
main();
