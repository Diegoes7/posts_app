import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmailTest(to: string, html: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'nguitsccmhxvudrs@ethereal.email',           // testAccount.user,
      pass: 'Pfy57hqnEj26RF964S',                      // testAccount.pass,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"This is system email" <support@ethereal.email>', // sender address
    to, // list of receivers
    subject: "Change password", // Subject line
    // text, // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
