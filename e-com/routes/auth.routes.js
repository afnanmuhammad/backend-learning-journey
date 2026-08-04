import express from "express";
import User from "../models/user.model.js";
import {
  validateRegister,
  handleValidationErrors,
  validateLogin, updateValidate
} from "../validators/auth.validators.js";
import { generateToken } from "../helpers/jwt.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

// Register
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return errorResponse(res, 400, req.t("emailAlreadyExists"));
      }

      // Create new user
      const user = new User(req.body);

      // Save user
      await user.save();

      // Generate JWT token
      const token = generateToken(user);

      // Success response
      return successResponse(
        res,
        req.t("User registered successfully"),
        201,
        user,
        token,
      );
    } catch (error) {
      console.error("Register Error:", error);

      return errorResponse(res, 400, error.message);
    }
  },
);

// Login
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const userData = await User.findOne({ email });

      if (!userData) {
        return errorResponse(res, 401, req.t("invalidCredentials"));
      }

      // Compare password
      const isPasswordValid = await userData.comparePassword(password);

      if (!isPasswordValid) {
        return errorResponse(res, 401, req.t("invalidCredentials"));
      }

      // Generate token
      const token = generateToken(userData);

      // Success response
      return successResponse(res, req.t("loginSuccess"), 200, userData, token);
    } catch (error) {
      console.error("Login Error:", error);

      return errorResponse(res, 500, req.t("somethingWentWrong"));
    }
  },
);

// Get user Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.auth.id).select("-password");

    if (!user) {
      return errorResponse(res, 404, req.t("userNotFound"));
    }

    return successResponse(res, req.t("profileFetchedSuccessfully"), 200, user);
  } catch (error) {
    console.error(error);

    return errorResponse(res, 500, req.t("somethingWentWrong"));
  }
});

// Update User Profle
router.put("/profile", updateValidate, handleValidationErrors, authMiddleware, async (req, res) => {
  try {
    const userId = req.auth.id;
    const updateBody = req.body; 

    if (updateBody.email) {
  const existingUserByEmail = await User.findOne({
    email: updateBody.email,
    // _id: { $ne: userId }
  });

  if (existingUserByEmail) {
    return errorResponse(
      res,
      400,
      req.t("emailAlreadyExists")
    );
  }
}

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, req.t("userNotFound"));
    }

    Object.keys(updateBody).forEach((key) => {
      user[key] = updateBody[key];
    });

    await user.save();

    return successResponse(
      res,
      req.t("userUpdatedSuccessfully"),
      200,
      user
    );
  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      500,
      req.t("somethingWentWrong")
    );
  }
});

export default router;
