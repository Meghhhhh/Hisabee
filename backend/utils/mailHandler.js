import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/* ---------- EMAIL TEMPLATES (UNCHANGED) ---------- */

export const otpHtml = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f4f4; padding:20px }
    .container {
      background:#fff; padding:20px; border-radius:8px;
      max-width:500px; margin:auto;
    }
    .otp-code {
      font-size:24px; font-weight:bold; color:#e74c3c;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Your OTP Code</h2>
    <p>Your OTP is:</p>
    <div class="otp-code">${otp}</div>
    <p>This OTP expires in 5 minutes.</p>
  </div>
</body>
</html>
`;

export const passwordResetHtml = (resetToken, resetUrl) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial; background:#f4f4f4; padding:20px">
  <div style="background:#fff; padding:30px; border-radius:8px; max-width:500px; margin:auto">
    <h2>Password Reset Request</h2>
    <p>Use the code below or click the button:</p>

    <div style="font-size:24px; font-weight:bold; color:#e74c3c; text-align:center">
      ${resetToken}
    </div>

    <div style="text-align:center; margin:20px">
      <a href="${resetUrl}"
         style="padding:12px 30px; background:#10b981; color:#fff; text-decoration:none; border-radius:5px">
        Reset Password
      </a>
    </div>

    <p style="font-size:12px;color:#777">
      This link expires in 15 minutes.
    </p>
  </div>
</body>
</html>
`;

/* ---------- SEND EMAIL ---------- */

const sendMessage = async (to, subject, html) => {
  try {
    const { error } = await resend.emails.send({
      from: `Hisabee <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Email sending failed");
    }
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

export default sendMessage;
