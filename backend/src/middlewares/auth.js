import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// Admin JWT Authentication Middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Admin authentication required.",
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production"
    );

    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        message: "Access denied. Admin account not found or inactive.",
        error: "Invalid token",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access denied. Admin session expired. Please log in again.",
        error: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Access denied. Invalid admin token.",
        error: "Invalid token",
      });
    } else {
      return res.status(500).json({
        message: "Server error during authentication",
        error: error.message,
      });
    }
  }
};

// User JWT Authentication Middleware (for regular users)
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. User authentication required.",
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production"
    );

    // Check if user still exists
    const User = (await import("../models/user.model.js")).default;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Access denied. User account not found.",
        error: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access denied. User session expired. Please log in again.",
        error: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Access denied. Invalid user token.",
        error: "Invalid token",
      });
    } else {
      return res.status(500).json({
        message: "Server error during authentication",
        error: error.message,
      });
    }
  }
};
