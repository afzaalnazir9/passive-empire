import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decodeToken, encodeToken } from "../utils/jwtToken.js";
import { Resend } from "resend";
import mongoose from "mongoose";


// @desc    Auth user & get token
// @route   POST /users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bundles: user.bundles,
      totalCoins: user.coins
    });

  } else {
    res.status(401).json({
      message: "Invalid email or password",
    });
    throw new Error("Invalid email or password");
  }
});

const loginUrl = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const decoded = decodeToken(token);
  const { email } = decoded;
  const user = await User.findById(email);
  if (user) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bundles: user.bundles,
      totalCoins: user.coins
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const Token = asyncHandler(async (req, res) => {
  const userId = "65e0f5c4c3c7be6bcc43664b";

  try {
    const resetUserToken = encodeToken(userId, "24h");
    res.send({ token: `/login?token=${resetUserToken}` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// @desc    Register a new user
// @route   POST /users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email)

  const existingUser = await User.findOne({ $or: [{ name }, { email }] });
  console.log("existingUser :>> ", existingUser)
  if (existingUser) {
    if (existingUser.name === name && existingUser.email === email) {
      res.status(400);
      throw new Error("User with this name and email already exists");
    } else if (existingUser.name === name) {
      res.status(400);
      throw new Error("User with this name already exists");
    } else {
      res.status(400);
      throw new Error("User with this email already exists");
    }
  }


  // Create the user
  const user = await User.create({
    name,
    email,
    password,
  });

  console.log("create user :>> ", user)
  // Respond with the user data and token
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    POST user profile
// @route   POST /users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bundles: user.bundles,
      totalCoins: user.coins
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PATCH /users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findById(userId);

  if (user) {
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    forget password
// @route   POST /users/forget-password
// @access  Public
const forgetPassword = asyncHandler(async (req, res) => {
  // const {Resend_API} = process.env;
  const email = req.body.email;

  // const resend = new Resend(Resend_API);

  // check user in the database or not
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "User with that email does not exist",
    });
  }
  // Generate JWT token
  const tokenData = email;
  const resetUserToken = encodeToken(tokenData, "24h");
  // Save token and send reset password email
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${resetUserToken}`;
    const response = await resend.emails.send({
      from: process.env.ADMIN_EMAIL ?? "dewqfinancehelp@resend.dev",
      to: email,
      subject: "Reset Password",
      html: `Forgot Password Link <button><a href="${resetUrl}">Click Here</a></button>`,
    });
    res
      .status(200)
      .json({ success: true, data: "Email sent", response: response });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Email failed to send." });
  }
});

// @desc    reset password
// @route   POST /users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  if (!token) return res.status(401).send({ error: "Unauthorized access" });
  if (!password) return res.status(400).json({ res: "please enter password" });
  try {
    var decoded = decodeToken(token);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).send({ error: "User not found" });
    user.password = password;
    await user.save();
    return res.status(200).send({ message: "Password Reset successful" });
  } catch (e) {
    return res.status(500).send({ error: "Server error" });
  }
});

// Delete user account

const deleteUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Error deleting user account", error: error.message });
  }
});

const updateUserData = asyncHandler(async (req, res) => {
  const { userId, updatedCoins, updatedMyLeaderBoard } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "The user not found" })
  }
  else {
    user.coins = updatedCoins;
    user.myLeaderBoard = updatedMyLeaderBoard;
  }
  await user.save();

  res.json({
    message: "User updated successfully",
    user,
  });
})

export {
  authUser,
  registerUser,
  logoutUser,
  loginUrl,
  getUserProfile,
  updateUserProfile,
  forgetPassword,
  resetPassword,
  Token,
  deleteUserAccount,
  updateUserData
};
