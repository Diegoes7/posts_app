import nodemailer from 'nodemailer';

(async () => {
  const testAccount = await nodemailer.createTestAccount();

  console.log('✅ New Ethereal Account:');
  console.log(`User: ${testAccount.user}`);
  console.log(`Pass: ${testAccount.pass}`);
  console.log(`SMTP Host: ${testAccount.smtp.host}`);
  console.log(`SMTP Port: ${testAccount.smtp.port}`);
  console.log(`Secure: ${testAccount.smtp.secure}`);
})();

// New Ethereal Account:
// User: rxzhp7kz3yifamcg@ethereal.email
// Pass: E8QWtYmgst5s8qNZNb
// SMTP Host: smtp.ethereal.email
// SMTP Port: 587
// Secure: false
