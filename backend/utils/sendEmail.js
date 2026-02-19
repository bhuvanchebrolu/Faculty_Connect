import sgMail from "@sendgrid/mail";

console.log("KEY START:", process.env.SENDGRID_API_KEY?.substring(0, 5));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── Shared HTML Shell ────────────────────────────────────────────────────────
const emailShell = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Faculty Connect</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #fef9e7;
      font-family: 'DM Sans', Arial, sans-serif;
      color: #1a1a1a;
    }

    .wrapper {
      max-width: 620px;
      margin: 40px auto;
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
      border: 1.5px solid #facc15;
    }

    /* ── Header ── */
    .header {
      background: #000;
      padding: 36px 40px 28px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, #facc15 0%, transparent 70%);
      opacity: 0.18;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -40px; left: -40px;
      width: 150px; height: 150px;
      background: radial-gradient(circle, #facc15 0%, transparent 70%);
      opacity: 0.14;
    }
    .header-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      color: #facc15;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }
    .header-logo span {
      color: #fff;
    }
    .header-sub {
      color: #999;
      font-size: 12px;
      margin-top: 6px;
      letter-spacing: 2px;
      text-transform: uppercase;
      position: relative;
      z-index: 1;
    }

    /* ── Yellow accent bar ── */
    .accent-bar {
      height: 4px;
      background: linear-gradient(90deg, #facc15 0%, #fde68a 50%, #facc15 100%);
    }

    /* ── Body ── */
    .body {
      padding: 40px 44px 32px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #111;
    }
    .intro {
      font-size: 15px;
      color: #444;
      line-height: 1.7;
      margin-bottom: 24px;
    }

    /* ── Yellow highlight box (OTP / status badge) ── */
    .highlight-box {
      background: #fefce8;
      border: 2px solid #facc15;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }

    /* ── Info table ── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    .info-table th {
      background: #fef9c3;
      text-align: left;
      padding: 10px 14px;
      font-weight: 600;
      color: #92400e;
      width: 36%;
      border-bottom: 1px solid #fde68a;
    }
    .info-table td {
      padding: 10px 14px;
      color: #222;
      border-bottom: 1px solid #f3f4f6;
    }
    .info-table tr:last-child th,
    .info-table tr:last-child td {
      border-bottom: none;
    }

    /* ── Notice strip ── */
    .notice {
      background: #fffbeb;
      border-left: 4px solid #facc15;
      border-radius: 0 8px 8px 0;
      padding: 12px 16px;
      font-size: 13px;
      color: #78350f;
      margin: 20px 0;
      line-height: 1.6;
    }

    /* ── CTA Button ── */
    .btn {
      display: inline-block;
      background: #facc15;
      color: #000;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      letter-spacing: 0.5px;
      margin-top: 8px;
    }

    /* ── Footer ── */
    .footer {
      background: #111;
      padding: 24px 40px;
      text-align: center;
    }
    .footer p {
      color: #555;
      font-size: 12px;
      line-height: 1.8;
    }
    .footer .year {
      color: #facc15;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">Faculty<span>Connect</span></div>
      <div class="header-sub">NIT Trichy · Research Collaboration</div>
    </div>
    <div class="accent-bar"></div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message — please do not reply.</p>
      <p class="year">© 2026 FacultyConnect · National Institute of Technology Tiruchirappalli</p>
    </div>
  </div>
</body>
</html>
`;

// ─── Send ─────────────────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, body, html }) => {
  console.log('=== Environment Variables Check ===');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET (length: ' + process.env.SENDGRID_API_KEY.length + ')' : 'NOT SET');
  console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
  console.log('===================================');

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@facultyconnect.com",
      subject,
      text: body,
      html: html || body.replace(/\n/g, "<br>"),
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    if (error.response) {
      console.error("SendGrid error body:", error.response.body);
    }
    return { success: false, error: error.message };
  }
};

// ─── OTP Email ────────────────────────────────────────────────────────────────
const sendOTPEmail = async (email, otp, name) => {
  const subject = "Faculty Connect — Verify Your Email";

  const body = `Hi ${name},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nBest regards,\nFaculty Connect Team`;

  const html = emailShell(`
    <p class="greeting">Hi ${name} 👋</p>
    <p class="intro">
      Welcome to <strong>Faculty Connect</strong>! We're thrilled to have you join NIT Trichy's
      research collaboration platform. Use the code below to verify your email and complete your
      account setup.
    </p>

    <div class="highlight-box">
      <p style="font-size:12px;color:#92400e;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Your Verification Code</p>
      <p style="font-size:42px;font-weight:700;letter-spacing:12px;color:#000;font-family:'Playfair Display',serif;">${otp}</p>
      <p style="font-size:12px;color:#777;margin-top:10px;">⏳ Expires in <strong>10 minutes</strong></p>
    </div>

    <div class="notice">
      <strong>🔒 Security Notice:</strong> Never share this code with anyone.
      If you didn't request this, you can safely ignore this email.
    </div>

    <p style="font-size:14px;color:#444;line-height:1.7;">
      After verification, you'll be able to discover research projects, connect with faculty,
      and start collaborating right away.
    </p>
  `);

  return sendEmail({ to: email, subject, body, html });
};

// ─── Application Status Email (to Student) ───────────────────────────────────
const sendApplicationStatusEmail = async (email, name, projectTitle, status, feedback = null) => {
  const isApproved = status === "approved";

  const subject = isApproved
    ? `🎉 Application Approved — ${projectTitle}`
    : `Application Update — ${projectTitle}`;

  const body = `Hi ${name},\n\nYour application for "${projectTitle}" has been ${status}.\n\n${
    feedback ? `Feedback: ${feedback}\n\n` : ""
  }${isApproved ? "Please reach out to your professor for next steps.\n\n" : ""}Best regards,\nFaculty Connect Team`;

  const statusColor   = isApproved ? "#16a34a" : "#dc2626";
  const statusBg      = isApproved ? "#f0fdf4" : "#fef2f2";
  const statusBorder  = isApproved ? "#bbf7d0" : "#fecaca";
  const statusIcon    = isApproved ? "✅" : "📋";
  const statusLabel   = isApproved ? "Approved" : "Not Selected";

  const html = emailShell(`
    <p class="greeting">Hi ${name},</p>
    <p class="intro">
      We have an update regarding your application to the following research project on
      <strong>Faculty Connect</strong>.
    </p>

    <div class="highlight-box" style="background:${statusBg};border-color:${statusBorder};margin-bottom:20px;">
      <p style="font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Project</p>
      <p style="font-size:17px;font-weight:700;color:#111;margin-bottom:16px;">${projectTitle}</p>
      <p style="font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Application Status</p>
      <p style="font-size:26px;font-weight:700;color:${statusColor};">${statusIcon} ${statusLabel}</p>
    </div>

    ${feedback ? `
    <div class="notice" style="border-left-color:#facc15;background:#fffbeb;">
      <strong>💬 Professor's Feedback:</strong><br/>
      <span style="color:#333;margin-top:4px;display:block;">${feedback}</span>
    </div>` : ""}

    ${isApproved ? `
    <div class="notice" style="border-left-color:#16a34a;background:#f0fdf4;color:#14532d;">
      <strong>🚀 Next Steps:</strong> Please reach out to your professor directly to discuss
      onboarding, timelines, and responsibilities.
    </div>` : `
    <p style="font-size:14px;color:#555;line-height:1.7;">
      Don't be discouraged — there are many more exciting projects available on Faculty Connect.
      Keep exploring and applying!
    </p>`}
  `);

  return sendEmail({ to: email, subject, body, html });
};

// ─── New Application Email (to Professor) ────────────────────────────────────
const sendNewApplicationEmail = async (email, professorName, projectTitle, applicantData) => {
  const subject = `📩 New Application — ${projectTitle}`;

  const body = `Hi ${professorName},\n\nA new student has applied to your project "${projectTitle}".\n\nApplicant: ${applicantData.name} (${applicantData.email})\nRoll No: ${applicantData.rollNumber} | Year: ${applicantData.year} | Branch: ${applicantData.branch} | CGPA: ${applicantData.cgpa}\n\nPlease log in to Faculty Connect to review the full application.\n\nBest regards,\nFaculty Connect Team`;

  const html = emailShell(`
    <p class="greeting">Hi Prof. ${professorName},</p>
    <p class="intro">
      Great news! A student has just applied to one of your research projects on
      <strong>Faculty Connect</strong>. Here's a quick summary of the applicant.
    </p>

    <div class="highlight-box" style="text-align:left;padding:18px 22px 14px;">
      <p style="font-size:11px;color:#92400e;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Project</p>
      <p style="font-size:17px;font-weight:700;color:#111;">${projectTitle}</p>
    </div>

    <table class="info-table">
      <tr><th>Full Name</th><td>${applicantData.name}</td></tr>
      <tr><th>Email</th><td>${applicantData.email}</td></tr>
      <tr><th>Phone</th><td>${applicantData.phone}</td></tr>
      <tr><th>Roll Number</th><td>${applicantData.rollNumber}</td></tr>
      <tr><th>Year</th><td>${applicantData.year}</td></tr>
      <tr><th>Branch</th><td>${applicantData.branch}</td></tr>
      <tr><th>CGPA</th><td><strong>${applicantData.cgpa}</strong></td></tr>
    </table>

    <div class="notice">
      <strong>📌 Action Required:</strong> Log in to Faculty Connect to view the full profile,
      resume, and statement of purpose before making your decision.
    </div>

    <div style="text-align:center;margin-top:28px;">
      <a class="btn" href="https://facultyconnect.nittrchy.ac.in/dashboard">
        Review Application →
      </a>
    </div>
  `);

  console.log("email sent:", body);
  return sendEmail({ to: email, subject, body, html });
};

export {
  sendEmail,
  sendOTPEmail,
  sendApplicationStatusEmail,
  sendNewApplicationEmail,
};