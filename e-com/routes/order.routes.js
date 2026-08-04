import express from "express";
import mongoose from "mongoose";
import { orderModel } from "../models/order.model.js";
import Product from "../models/product.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userAndAdmin } from "../middleware/roles.middleware.js";
import { successResponse, errorResponse } from "../helpers/response.js";

const router = express.Router();

// Create Order
router.post("/", authMiddleware, userAndAdmin, async (req, res) => {
  try {
    const { orderItems } = req.body;
    const { auth: currentUser } = req;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return errorResponse(res, 400, req.t("orderItemsRequired"));
    }

    // Check products and stock
    for (const item of orderItems) {
      if (!item.product || !item.quantity) {
        return errorResponse(
          res,
          404,
          req.t("orderItemValidation")`Product not found: ${item.product}`,
        );
      }

      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return errorResponse(
          res,
          400,
          req.t("invalidProductId"),
          invaliId,
          item.product,
        );
      }

      if (typeof item.quantity !== "number" || item.quantity < 1) {
        return errorResponse(res, 400, req.t("quantityMustBeAtLeast1"));
      }

      if (!Number.isInteger(item.quantity)) {
        return errorResponse(
          res,
          400,
          req.t("quantityMustBeWholeNumber"),
          invalidQuantity,
          item.quantity,
        );
      }
    }
  } catch (error) {
    console.error("Create order error:", error);

    return errorResponse(res, 500, error.message || "Failed to create order");
  }
});

export default router;
