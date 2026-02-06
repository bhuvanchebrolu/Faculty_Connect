
import express from "express";
const router = express.Router();


import { authenticate } from "../middlewares/auth.middleware.js";


import  {
  sendOTP,
  verifyOTP,
  login,
  getCurrentUser,
  logout,
}  from "../controllers/auth.controller.js";



// REGISTRATION (2-STEP OTP FLOW)
// Step 1: Detects role from email, sends OTP to email
router.post("/register/send-otp", sendOTP);


// Step 2: Verifies OTP, creates account, returns JWT token
router.post("/register/verify-otp", verifyOTP);



// LOGIN
// Returns JWT token if credentials valid and role matches
router.post("/login", login);



// USER MANAGEMENT (PROTECTED ROUTES)

router.get("/me", authenticate, getCurrentUser);
// Logout endpoint (client-side token deletion)
router.post("/logout", authenticate, logout);


export default router;