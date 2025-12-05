import User from "../../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
  try {
    const requestData = req.body;
    const { firstName, lastName, email, password, phone, address } = requestData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const requestData = req.body;
    const { email, password } = requestData;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production", {
      expiresIn: "1d",
    });


    res.json({
      token,
      user: { 
        _id: user._id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email,
        phone: user.phone 
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get User Profile
export const profile = async (req, res) => {
  try {
    // Check if req.user exists and has an _id property
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or missing token" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    // Handle possible JSON parse errors or other server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit User Profile
export const profileEdit = async (req, res) => {
  try {
    const user = req.user;
    const requestData = req.body;
    const updates = {};
    const allowedFields = ["firstName", "lastName", "email", "phone", "address", "password"];
    allowedFields.forEach((field) => {
      if (requestData[field]) {
        updates[field] = requestData[field];
      }
    });

    // Check if email is being updated and is already taken by another user
    if (updates.email) {
      const existingEmail = await User.findOne({
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

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};