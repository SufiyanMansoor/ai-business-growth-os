import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else if (process.env.RESEND_API_KEY) {
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
    });
  }

  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[Email Demo] To: ${to}, Subject: ${subject}`);
    return { messageId: 'demo-' + Date.now(), demo: true };
  }

  return transport.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@aigrowthos.com',
    to,
    subject,
    html,
    text,
  });
}

export async function sendOutreachEmail(to, subject, body) {
  return sendEmail({
    to,
    subject,
    html: body.replace(/\n/g, '<br>'),
    text: body,
  });
}
