import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ADDR,
    pass: process.env.GMAIL_PASS,
  },
});

const emailTemplateWrapper = (content, title = "Report2Clean") => {
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #f9fafb; padding: 20px; color: #1f2937;">
      <div style="background-color: #1d4ed8; color: white; padding: 16px 24px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 20px;">${title}</h2>
      </div>
      <div style="background-color: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        ${content}
      </div>
      <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">
        <div>Sent on: ${formattedDateTime}</div>
        © ${now.getFullYear()} Report2Clean. All rights reserved.<br/>
        <small>This is an automated email. Please do not reply directly to this message.</small>
      </div>
    </div>
  `;
};

// --- Welcome Email ---
const RegisterMail = async (toEmail, userName) => {
  const htmlContent = emailTemplateWrapper(`
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Welcome to <strong>Report2Clean</strong>! You're now part of a growing community that cares about a cleaner and healthier environment.</p>
    <ul style="padding-left: 20px;">
      <li>📸 Report environmental issues in your area</li>
      <li>📍 Pin exact locations using our map interface</li>
      <li>🔔 Stay updated on local cleanup activities</li>
    </ul>
    <p>We’re thrilled to have you onboard!</p>
    <p>Best regards,<br/><strong>The Report2Clean Team</strong></p>
  `, "Welcome to Report2Clean 🎉");

  const info = await transporter.sendMail({
    from: `"Report2Clean" <${process.env.GMAIL_ADDR}>`,
    to: toEmail,
    subject: "Welcome to Report2Clean 🎉",
    html: htmlContent,
  });

  console.log("Registration email sent:at",new Date().toLocaleString(), info.messageId);
};

// --- Report Submission Confirmation Email ---
const ReportSubmission = async (receiverMail, username, title, location) => {
  const htmlContent = emailTemplateWrapper(`
    <p>Hello <strong>${username}</strong>,</p>
    <p>Thank you for submitting a report to <strong>Report2Clean</strong>. We’ve received your report and it has been <span style="color: green;"><strong>successfully submitted</strong></span>.</p>

    <div style="margin: 16px 0; padding: 12px; background-color: #f3f4f6; border-left: 4px solid #1d4ed8;">
      <p style="margin: 0;"><strong>Report Title:</strong> ${title}</p>
      <p style="margin: 4px 0 0;"><strong>Location:</strong> ${location}</p>
    </div>

    <p>Your report is under review. We’ll notify you once it’s verified.</p>
    <p>Thank you for helping us build a cleaner world. 🌱</p>
    <p>Warm regards,<br/><strong>The Report2Clean Team</strong></p>
  `, "Report Submission Confirmation ✅");

  const info = await transporter.sendMail({
    from: '"Report2Clean Team" <report2clean@gmail.com>',
    to: receiverMail,
    subject: "✅ Your Report Has Been Submitted – Report2Clean",
    html: htmlContent,
  });

  console.log("📨 Report submission email sent:", info.messageId);
};

// --- Verification Status Email ---
const VerificationReport = async (receiverEmail, username) => {
  try {
    const htmlContent = emailTemplateWrapper(`
      <p>Hi <strong>${username}</strong>,</p>
      <p>Thanks for submitting your verification documents to <strong>Report2Clean</strong>.</p>
      <p>Our team is reviewing your documents. This may take <strong>12 to 24 hours</strong>.</p>
      <p>Once verified, your account will be marked as verified to ensure platform security and trust.</p>
      <p>If we need more details, we’ll reach out to you via this email.</p>
      <p>Best regards,<br/>The Report2Clean Team</p>
    `, "Verification Under Review 🔍");

    const info = await transporter.sendMail({
      from: '"Report2Clean" <no-reply@report2clean.org>',
      to: receiverEmail,
      subject: "Your Verification Documents Are Being Reviewed",
      html: htmlContent,
    });

    console.log("✅ Verification email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
};
const NearbyReportAlert = async (receiverMail, receiverName, senderName, reportTitle, reportAddress) => {
  const htmlContent = emailTemplateWrapper(`
    <p>Hello <strong>${receiverName}</strong>,</p>
    <p>Just a heads up! <strong>${senderName}</strong> has submitted a new report nearby:</p>

    <div style="margin: 16px 0; padding: 12px; background-color: #f3f4f6; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>Report Title:</strong> ${reportTitle}</p>
      <p style="margin: 4px 0 0;"><strong>Location:</strong> ${reportAddress}</p>
    </div>

    <p>Stay aware and help us keep the area clean! 🌱</p>
    <p>Warm regards,<br/><strong>The Report2Clean Team</strong></p>
  `, "New Report Alert Nearby 📍");

  const info = await transporter.sendMail({
    from: '"Report2Clean Alerts" <report2clean@gmail.com>',
    to: receiverMail,
    subject: "📍 New Environmental Report Submitted Nearby – Report2Clean",
    html: htmlContent,
  });

  console.log("📨 Nearby report alert email sent:", info.messageId);
};

export { transporter, RegisterMail, ReportSubmission, VerificationReport,NearbyReportAlert };
