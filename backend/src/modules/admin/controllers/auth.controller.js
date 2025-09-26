import Admin from "../../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

// Register Admin
export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      username,
      password: hashedPassword,
      email,
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login Admin
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const payload = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Middleware to authenticate using passport-jwt
export const authenticate = passport.authenticate("jwt", { session: false });

// Get Admin Profile
export const profileGet = [
  authenticate,
  async (req, res) => {
    try {
      // req.user is set by passport after successful authentication
      const admin = await Admin.findById(req.user.id).select("-password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json(admin);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
];

// Edit Admin Profile
export const profileEdit = [
  authenticate,
  async (req, res) => {
    try {
      const updates = {};
      const allowedFields = ["username", "email", "password"];
      allowedFields.forEach((field) => {
        if (req.body[field]) {
          updates[field] = req.body[field];
        }
      });

      // If password is being updated, hash it
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const admin = await Admin.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json({ message: "Profile updated successfully", admin });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
];
