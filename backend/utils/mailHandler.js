// import 'dotenv/config';
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.APP_EMAIL_HOST,
//   port: process.env.APP_EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.APP_EMAIL,
//     pass: process.env.APP_PASSWORD, 
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// export const otpHtml = otp => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f4f4f4;
//           color: #333;
//           padding: 20px;
//         }
//         .container {
//           background-color: white;
//           padding: 20px;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           max-width: 500px;
//           margin: 0 auto;
//         }
//         h2 {
//           color: #2c3e50;
//         }
//         .otp-code {
//           font-size: 24px;
//           font-weight: bold;
//           color: #e74c3c;
//           margin-top: 20px;
//         }
//         .footer {
//           font-size: 12px;
//           color: #7f8c8d;
//           margin-top: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>Your OTP Code</h2>
//         <p>Hello,</p>
//         <p>Here is your one-time password (OTP) for authentication:</p>
//         <div class="otp-code">${otp}</div>
//         <p>This OTP will expire in 5 minutes. Please enter it on the website to complete the process.</p>
//         <div class="footer">If you didn't request this, please ignore this email.</div>
//       </div>
//     </body>
//     </html>
//   `;

// export const passwordResetHtml = (resetToken, resetUrl) => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f4f4f4;
//           color: #333;
//           padding: 20px;
//         }
//         .container {
//           background-color: white;
//           padding: 30px;
//           border-radius: 8px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           max-width: 500px;
//           margin: 0 auto;
//         }
//         h2 {
//           color: #2c3e50;
//         }
//         .reset-code {
//           font-size: 24px;
//           font-weight: bold;
//           color: #e74c3c;
//           margin: 20px 0;
//           text-align: center;
//           padding: 15px;
//           background-color: #f8f9fa;
//           border-radius: 5px;
//           letter-spacing: 3px;
//         }
//         .reset-button {
//           display: inline-block;
//           padding: 12px 30px;
//           background-color: #10b981;
//           color: white;
//           text-decoration: none;
//           border-radius: 5px;
//           margin: 20px 0;
//           text-align: center;
//         }
//         .footer {
//           font-size: 12px;
//           color: #7f8c8d;
//           margin-top: 20px;
//         }
//         .warning {
//           background-color: #fff3cd;
//           border-left: 4px solid #ffc107;
//           padding: 10px;
//           margin: 15px 0;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>Password Reset Request</h2>
//         <p>Hello,</p>
//         <p>You requested to reset your password for your Hisabee account. Use the reset code below or click the button to reset your password:</p>
//         <div class="reset-code">${resetToken}</div>
//         <div style="text-align: center;">
//           <a href="${resetUrl}" class="reset-button">Reset Password</a>
//         </div>
//         <div class="warning">
//           <strong>Important:</strong> This reset code will expire in 15 minutes. If you didn't request this, please ignore this email and your password will remain unchanged.
//         </div>
//         <div class="footer">If the button doesn't work, copy and paste this link into your browser: ${resetUrl}</div>
//       </div>
//     </body>
//     </html>
//   `;

// const sendMessage = async (to, subject, html) => {
//   await transporter.sendMail({
//     from: process.env.APP_EMAIL,
//     to,
//     subject,
//     html,
//   });

//   // console.log('Message sent:', info.messageId);
// };

// export default sendMessage;


import 'dotenv/config';
import nodemailer from 'nodemailer';

// Determine SMTP configuration based on environment variables
// Supports both explicit SMTP settings and service-based configuration
const getTransporterConfig = () => {
  // If explicit SMTP settings are provided, use them (recommended for production)
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure:
        process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      // Connection timeout settings for cloud platforms
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
      // Disable connection pooling on Render to avoid connection issues
      pool: false,
      // TLS options
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    };
  }

  // Fallback to service-based configuration (for backward compatibility)
  // For Gmail, use explicit settings if service is 'gmail'
  if (
    process.env.APP_SERVICE_TYPE === 'gmail' ||
    !process.env.APP_SERVICE_TYPE
  ) {
    return {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      requireTLS: true,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      pool: false,
      tls: {
        rejectUnauthorized: false,
      },
    };
  }

  // For other services, use the service name but add timeout settings
  return {
    service: process.env.APP_SERVICE_TYPE,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    pool: false,
    tls: {
      rejectUnauthorized: false,
    },
  };
};

const transporter = nodemailer.createTransport(getTransporterConfig());

export const otpHtml = otp => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          padding: 20px;
        }
        .container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }
        h2 {
          color: #2c3e50;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
          color: #e74c3c;
          margin-top: 20px;
        }
        .footer {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your OTP Code</h2>
        <p>Hello,</p>
        <p>Here is your one-time password (OTP) for authentication:</p>
        <div class="otp-code">${otp}</div>
        <p>This OTP will expire in 5 minutes. Please enter it on the website to complete the process.</p>
        <div class="footer">If you didn't request this, please ignore this email.</div>
      </div>
    </body>
    </html>
  `;

export const passwordResetHtml = (resetToken, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          padding: 20px;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }
        h2 {
          color: #2c3e50;
        }
        .reset-code {
          font-size: 24px;
          font-weight: bold;
          color: #e74c3c;
          margin: 20px 0;
          text-align: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
          letter-spacing: 3px;
        }
        .reset-button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 20px;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 10px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password for your Hisabee account. Use the reset code below or click the button to reset your password:</p>
        <div class="reset-code">${resetToken}</div>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="reset-button">Reset Password</a>
        </div>
        <div class="warning">
          <strong>Important:</strong> This reset code will expire in 15 minutes. If you didn't request this, please ignore this email and your password will remain unchanged.
        </div>
        <div class="footer">If the button doesn't work, copy and paste this link into your browser: ${resetUrl}</div>
      </div>
    </body>
    </html>
  `;

const sendMessage = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to,
      subject,
      html,
    });
    console.log('Message sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendMessage;

