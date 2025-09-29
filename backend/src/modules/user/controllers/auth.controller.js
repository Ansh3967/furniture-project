import Admin from "../../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Admin
export const register = async (req, res) => {
  try {
    const requestData = req.body;
    const { username, password, email } = requestData;

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

// Login Admin (by email)
export const login = async (req, res) => {
  try {
    const requestData = req.body;
    const { email, password } = requestData;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
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

// Get Admin Profile
export const profile = async (req, res) => {
  try {
    // Check if req.user exists and has an _id property
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or missing token" });
    }

    const admin = await Admin.findById(req.user._id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    // Handle possible JSON parse errors or other server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit Admin Profile
export const profileEdit = async (req, res) => {
  try {
    const user = req.user;
    const requestData = req.body;
    const updates = {};
    const allowedFields = ["username", "email", "password"];
    allowedFields.forEach((field) => {
      if (requestData[field]) {
        updates[field] = requestData[field];
      }
    });

    // Check if username is being updated and is already taken by another admin
    if (updates.username) {
      const existingUsername = await Admin.findOne({
        username: updates.username,
        _id: { $ne: user._id },
      });
      if (existingUsername) {
        return res
          .status(400)
          .json({ message: "Username is already taken by another user." });
      }
    }

    // Check if email is being updated and is already taken by another admin
    if (updates.email) {
      const existingEmail = await Admin.findOne({
        email: updates.email,
        _id: { $ne: user._id },
      });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email is already taken by another user." });
      }
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(
      user._id,
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
};
