
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.body - Plain text email body
 * @param {string} options.html - HTML email body (optional)
 */
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
      html: html || body.replace(/\n/g, "<br>"), // Convert plain text to HTML if HTML not provided
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("SendGrid error:", error);
    
    // Log detailed error info
    if (error.response) {
      console.error("SendGrid error body:", error.response.body);
    }
    
    // Don't throw - we want email failures to be non-blocking
    // The application should continue even if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP email for registration verification
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} name - User's name
 */
const sendOTPEmail = async (email, otp, name) => {
  const subject = " Faculty Connect - Verify Your Email";
  
  const body = `Hi ${name},

Welcome to Faculty Connect - NIT Trichy's Research Collaboration Platform!

Your verification code is: ${otp}

This code will expire in 10 minutes.

Please enter this code in the registration form to complete your account setup.

If you didn't request this code, please ignore this email.

Best regards,
Faculty Connect Team
National Institute of Technology Tiruchirappalli`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000 0%, #facc15 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: #facc15; color: #000; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #facc15; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1> Faculty Connect</h1>
          <p>NIT Trichy Research Collaboration Platform</p>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Welcome to Faculty Connect! We're excited to have you join our research collaboration platform.</p>
          
          <p>Your verification code is:</p>
          <div class="otp-box">${otp}</div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>Please enter this code in the registration form to complete your account setup.</p>
          
          <div class="warning">
            <strong> Security Notice:</strong> If you didn't request this code, please ignore this email. Never share this code with anyone.
          </div>
          
          <p>Best regards,<br>
          <strong>Faculty Connect Team</strong><br>
          National Institute of Technology Tiruchirappalli</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; 2026 Faculty Connect - NIT Trichy</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, body, html });
};

/**
 * Send application status notification email to student
 * @param {string} email - Student email
 * @param {string} name - Student name
 * @param {string} projectTitle - Project title
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} feedback - Optional feedback from professor
 */
const sendApplicationStatusEmail = async (email, name, projectTitle, status, feedback = null) => {
  const isApproved = status === "approved";
  const subject = isApproved
    ? `Application Approved - ${projectTitle}`
    : `Application Update - ${projectTitle}`;

  const body = `Hi ${name},

Your application for the project "${projectTitle}" has been ${status}.

${feedback ? `\nFeedback from Professor:\n${feedback}\n` : ""}
${isApproved ? "\nPlease reach out to your professor for next steps.\n" : ""}
Best regards,
Faculty Connect Team`;

  return sendEmail({ to: email, subject, body });
};

/**
 * Send new application notification to professor
 * @param {string} email - Professor email
 * @param {string} professorName - Professor name
 * @param {string} projectTitle - Project title
 * @param {Object} applicantData - Applicant details
 */
const sendNewApplicationEmail = async (email, professorName, projectTitle, applicantData) => {
  const subject = ` New Application - ${projectTitle}`;
  
  const body = `Hi ${professorName},

A new student has applied to your project "${projectTitle}".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPLICANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:         ${applicantData.name}
Email:        ${applicantData.email}
Phone:        ${applicantData.phone}
Roll Number:  ${applicantData.rollNumber}
Year:         ${applicantData.year}
Branch:       ${applicantData.branch}
CGPA:         ${applicantData.cgpa}

Please log in to Faculty Connect to review the complete application.

Best regards,
Faculty Connect Team`;

  return sendEmail({ to: email, subject, body });
};

export{
  sendEmail,
  sendOTPEmail,
  sendApplicationStatusEmail,
  sendNewApplicationEmail,
};