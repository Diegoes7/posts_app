import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';


// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string, userEmail: string) {
  // Configure SendGrid transport
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    }
  };

  const transporter = nodemailer.createTransport(sgTransport(options as any));

  // Email options
  const mailOptions = {
    from: userEmail, // Replace with your email address
    to, // Replace with recipient's email address
    subject: 'Welcome to My App!',
    text: 'Hello! This is a test email sent using Nodemailer and SendGrid.',
    html: '<b>Hello!</b><p>This is a test email sent using Nodemailer and SendGrid.</p>'
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
