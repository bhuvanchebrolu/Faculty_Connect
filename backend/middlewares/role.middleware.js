
import ApiError from "../utils/ApiError.js";

/**
 * Authorize user based on role
 * Use after authenticate middleware
 * @param {...string} roles - Allowed roles (e.g., "student", "professor", "admin")
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // req.user is already attached by authenticate middleware
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

export { authorizeRole };
