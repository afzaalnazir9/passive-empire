import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { decodeToken, encodeToken } from "../utils/jwtToken.js";
import { Resend } from "resend";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_TOKEN = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc    Auth user & get token
// @route   POST /users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (isPasswordValid) {
      if (user.role === "general") {
        generateToken(res, user._id);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          bundles: user.bundles,
          totalCoins: user.coins,
          userType: user.role,
        });
      } else if (user.role === "fellow" && user.isVerified) {
        generateToken(res, user._id);
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          bundles: user.bundles,
          totalCoins: user.coins,
          userType: user.role,
        });
      } else {
        return res.status(400).json({ message: "Please verify your email first" });
      }
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
  const { name, email, password, userType } = req.body;

  if (!userType || !['general', 'fellow'].includes(userType)) {
    return res.status(400).json({ message: "Invalid user type" });
  }

  const existingUserByName = await User.findOne({ name });
  if (existingUserByName) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  if (userType === 'fellow' && !email) {
    return res.status(400).json({ message: "Email is required for fellow users" });
  }

  if (userType === 'fellow') {
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already taken" });
    }
  }

  if (userType === 'general' && email) {
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already taken" });
    }
  }
  let newUser
  try {

    newUser = new User({
      name,
      email: userType === 'general' && !email ? null : email,
      password,
      role: userType,
    });

    await newUser.save();

    if (userType === 'fellow') {
      const verificationToken = JWT_TOKEN(newUser._id);
      newUser.verificationToken = verificationToken;
      await newUser.save();

      const { Resend_API } = process.env;
      const resend = new Resend(Resend_API);

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      try {
        let result = await resend.emails.send({
          from: process.env.ADMIN_EMAIL,
          to: email,
          subject: "Verify Your Email",
          html: `
            <p>Click the button below to verify your email:</p>
            <button>
              <a href="${verificationUrl}" style="text-decoration: none; color: white; background-color: #007bff;">Verify Email</a>
            </button>
            <p>If you did not request this, please ignore this email.</p>
          `,
        });
        if (result?.data) {
          return res.status(201).json({
            message: 'User registered successfully. Please check your email for the verification link.',
          });
        } else {
          if (newUser && newUser._id) {
            await User.findByIdAndDelete(newUser._id);
          }
          throw new Error(result?.error?.message || 'Unknown email sending error');
        }
      } catch (error) {
        if (newUser && newUser._id) {
          await User.findByIdAndDelete(newUser._id);
        }
        return res.status(500).json({
          message: error.message,

        });
      }
    }
    res.status(201).json({
      message: 'User registered successfully.',
    });
  } catch (dbError) {
    if (newUser && newUser._id) {
      await User.findByIdAndDelete(newUser._id);
    }
    return res.status(500).json({
      message: dbError.message,
    });
  }
});

// verifyEmailWithToken
const verifyEmailWithToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.id) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    const existingUser = await User.findById(decoded.id)
    if (!existingUser) {
      return res.status(404).json({ message: "The User not found" })
    }

    if (existingUser.verificationToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    existingUser.isVerified = true;
    existingUser.verificationToken = null;
    await existingUser.save();

    res.status(200).json({ message: 'Email successfully verified' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired, please request a new one' });
    }
    res.status(500).json({ message: 'Server error' });
  }

});

// resend email verification link

const resendVerificationToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (existingUser.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const verificationToken = generateToken(existingUser._id);
    existingUser.verificationToken = verificationToken;
    await existingUser.save();

    const { Resend_API } = process.env;
    const resend = new Resend(Resend_API);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    try {
      const response = await resend.emails.send({
        from: process.env.ADMIN_EMAIL ?? "dewqfinancehelp@resend.dev",
        to: email,
        subject: "Verify Your Email",
        html: `
                  <p>Click the button below to verify your email:</p>
                  <button>
                      <a href="${verificationUrl}" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border: none; border-radius: 5px;">Verify Email</a>
                  </button>
                  <p>If you did not request this, please ignore this email.</p>
                  `,
      });

      res.status(200).json({
        message: 'A new verification link has been sent to your email.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to resend verification email.',
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
  updateUserData,
  verifyEmailWithToken,
  resendVerificationToken
};
