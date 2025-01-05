import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Utility to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", 
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ email, password, name });

    const token = generateToken(user._id);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      })
      .json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token: token, 
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, 
        })
        .json({
          _id: user._id,
          email: user.email,
          name: user.name,
          token: token, 
        });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
