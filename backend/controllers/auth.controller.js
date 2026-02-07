import User from "../models/User.model.js";
import OTP from "../models/Otp.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken"

/**
 * Detect user role based on email format
 * @param {string} email - Email address
 * @returns {string} - 'student' or 'professor'
 */
const detectRoleFromEmail = (email) => {
  // Extract the part before @nitt.edu.in
  const localPart = email.split("@")[0];

  // If it's all digits, it's a student roll number
  // Example: 106121001@nitt.edu.in → student
  if (/^\d+$/.test(localPart)) {
    return "student";
  }

  // Otherwise it's a professor/admin name
  // Example: sharma@nitt.edu.in → professor
  return "professor";
};



/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d", // Default 7 days
  });
};



//Registration Flow
//2 steps 
//Step1: Send OTP
const sendOTP = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    rollNumber,
    year,
    branch,
    department,
    designation,
  } = req.body;

  // validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  // validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@nitt\.edu$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Email must be a valid @nitt.edu address");
  }

  // detect role from email
  const detectedRole = detectRoleFromEmail(email);

  // validate role-specific fields
  if (detectedRole === "student") {
    if (!rollNumber || !year || !branch) {
      throw new ApiError(
        400,
        "Roll number, year, and branch are required for student registration"
      );
    }

    // Validate year
    if (year < 1 || year > 4) {
      throw new ApiError(400, "Year must be between 1 and 4");
    }
  } else if (detectedRole === "professor") {
    if (!department) {
      throw new ApiError(
        400,
        "Department is required for professor registration"
      );
    }
  }

  // check if email already registered
  try{
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already registered. Please log in.");
    }
  }
  catch(err){
    if (err instanceof ApiError) {
      throw err; // Re-throw known API errors
    }
    console.error("Error checking existing user:", err);
    throw new ApiError(500, "Server error while checking email");
  }

  // generate OTP 
  const otp = generateOTP();
  console.log(`Generated OTP for ${email}: ${otp}`); // For debugging - remove in production

  //  prepare temp user data
  const tempUserData = {
    name,
    password, // Will be hashed after OTP verification
    role: detectedRole,
  };

  if (detectedRole === "student") {
    tempUserData.rollNumber = rollNumber;
    tempUserData.year = year;
    tempUserData.branch = branch;
  } else {
    tempUserData.department = department;
    if (designation) tempUserData.designation = designation;
  }

  // delete any existing OTP for this email
  await OTP.deleteMany({ email });

  // store OTP + temp data 
  await OTP.create({
    email,
    otp,
    tempUserData,
  });

  //  send OTP email 
  const emailResult = await sendOTPEmail(email, otp, name);

  if (!emailResult.success) {
    // Email failed but OTP is stored - student can still verify if they somehow got the OTP
    console.error("Failed to send OTP email:", emailResult.error);
  }

  res.status(200).json({
    success: true,
    message: `OTP sent to ${email}. Please check your email and verify within 10 minutes.`,
    detectedRole,
  });
});


//Step2:Verify OTP and create account
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // validate required fields
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  // find OTP record
  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord) {
    throw new ApiError(
      400,
      "OTP expired or not found. Please request a new OTP."
    );
  }

  //verify OTP 
  if (otpRecord.otp !== otp) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // create user account
  const userData = {
    name: otpRecord.tempUserData.name,
    email,
    password: otpRecord.tempUserData.password, // Will be hashed by pre-save hook
    role: otpRecord.tempUserData.role,
  };

  // Add role-specific fields
  if (otpRecord.tempUserData.role === "student") {
    userData.rollNumber = otpRecord.tempUserData.rollNumber;
    userData.year = otpRecord.tempUserData.year;
    userData.branch = otpRecord.tempUserData.branch;
  } else if (otpRecord.tempUserData.role === "professor") {
    userData.department = otpRecord.tempUserData.department;
    if (otpRecord.tempUserData.designation) {
      userData.designation = otpRecord.tempUserData.designation;
    }
  }

  const user = await User.create(userData);

  // delete OTP record 
  await OTP.deleteOne({ email });

  // generate JWT token
  const token = generateToken(user._id);

  // -send response 
  // Don't send password back
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.role === "student" && {
      rollNumber: user.rollNumber,
      year: user.year,
      branch: user.branch,
    }),
    ...(user.role === "professor" && {
      department: user.department,
      designation: user.designation,
    }),
  };

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: userResponse,
  });
});


//Login

const login = asyncHandler(async (req, res) => {
  const { email, password, expectedRole } = req.body;

  // validate required fields
  if (!email || !password || !expectedRole) {
    throw new ApiError(400, "Email, password, and role are required");
  }

  // validate expectedRole
  const allowedRoles = ["student", "professor", "admin"];
  if (!allowedRoles.includes(expectedRole)) {
    throw new ApiError(400, "Invalid role specified");
  }

  //find user by email
  // Need to explicitly select password since it's select: false in schema
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // role mismatch check
  if (user.role !== expectedRole) {
    // Provide helpful error message based on detected vs expected
    const roleLabels = {
      student: "Student",
      professor: "Professor",
      admin: "Admin",
    };

    throw new ApiError(
      403,
      `This is a ${roleLabels[user.role]} account. Please use the ${roleLabels[user.role]} login form.`
    );
  }

  // generate JWT token
  const token = generateToken(user._id);

  // send response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    ...(user.role === "student" && {
      rollNumber: user.rollNumber,
      year: user.year,
      branch: user.branch,
      resumeUrl: user.resumeUrl,
    }),
    ...(user.role === "professor" && {
      department: user.department,
      designation: user.designation,
    }),
  };

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: userResponse,
  });
});



// GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is already attached by authenticate middleware
  res.status(200).json({
    success: true,
    user: req.user,
  });
});



// LOGOUT
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please delete your token client-side.",
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export {
  sendOTP,
  verifyOTP,
  login,
  getCurrentUser,
  logout,
};

