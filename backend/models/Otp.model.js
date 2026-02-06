// ─────────────────────────────────────────────────────────────────────────────
// OTP.model.js
//
// Temporary storage for OTPs during registration flow.
// OTPs expire after 10 minutes and are automatically cleaned up.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  otp: {
    type: String,
    required: true,
  },

  // Registration data stored temporarily until OTP is verified
  tempUserData: {
    name: String,
    password: String, // Will be hashed after OTP verification
    role: String,
    // Student-specific
    rollNumber: String,
    year: Number,
    branch: String,
    // Professor-specific
    department: String,
    designation: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document will be automatically deleted after 10 minutes (600 seconds)
  },
});

// Index for faster lookups
otpSchema.index({ email: 1 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;