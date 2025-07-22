import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function sendEmailTest(to: string, html: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'rxzhp7kz3yifamcg@ethereal.email',           // testAccount.user,
      pass: 'E8QWtYmgst5s8qNZNb',                      // testAccount.pass,
    },
  });

  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: '"This is system email" <support@ethereal.email>', // sender address
      to, // list of receivers
      subject: "Change password", // Subject line
      // text, // plain text body
      html, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    const previewUrl = nodemailer.getTestMessageUrl(info);
    return previewUrl;
  } catch (err) {
    console.error("Email send error:", err);
    throw Error(`Mail error', ${err.message}`);
  }
}

export async function sendPasswordResetEmail(to: string, resetPasswordUrl: string) {
  const html = getResetPasswordEmailHtml(resetPasswordUrl);
  const previewUrl = await sendEmailTest(to, html);
  return previewUrl;
}

export function getResetPasswordEmailHtml(resetPasswordUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <div style="max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email. Your password will remain unchanged.</p>
        <p>To reset your password, click the link below:</p>

        <p>${resetPasswordUrl}</p>

        <p><strong>This link will expire in 30 minutes for your security.</strong></p>
        <p>If you continue to have issues, contact our support team at <a href="mailto:support@ethereal.email">support@ethereal.email</a>.</p>
        
        <p>Thank you,<br/>The Support Team</p>
        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}
