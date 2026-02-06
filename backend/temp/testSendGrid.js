import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

console.log("Testing SendGrid...");
console.log("API Key:", SENDGRID_API_KEY ? "SET" : "NOT SET");
console.log("From Email:", SENDGRID_FROM_EMAIL);

sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: "bhuvanchebrolu@gmail.com", // put YOUR real email
  from: SENDGRID_FROM_EMAIL, // must be verified in SendGrid
  subject: "SendGrid Test",
  text: "If you receive this, SendGrid is working!",
};

try {
  await sgMail.send(msg);
  console.log("✅ Email sent successfully!");
} catch (error) {
  console.error("❌ Error:", error.message);

  if (error.response) {
    console.error("Response body:", error.response.body);
  }
}
