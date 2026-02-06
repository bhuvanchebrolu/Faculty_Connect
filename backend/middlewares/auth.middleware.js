import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Authenticate user via JWT token
 * Extracts token from Authorization header, verifies it,
 * and attaches user to req.user
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Format: "Bearer <token>"
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found. Token invalid.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please log in again.");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please log in again.");
    } else {
      throw error;
    }
  }
});

/**
 * Authorize user based on role
 * Use after authenticate middleware
 * @param {...string} roles
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated. Please log in.");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. This resource is restricted to: ${roles.join(", ")}`
      );
    }

    next();
  };
};

export { authenticate, authorizeRole };
