import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgetPassword,
  resetPassword,
  loginUrl,
  Token,
  deleteUserAccount,
  updateUserData
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", protect, logoutUser);
router.post("/loginUrl", loginUrl);
router.get("/Token", Token);
router
  .route("/profile")
  .post(protect, getUserProfile)
  .patch(protect, updateUserProfile);
router.delete("/delete-account/:id", deleteUserAccount);

router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

router.put("/updateUserData", protect, updateUserData)

export default router;
