import express from "express";
import Product from "../models/product.model.js";

import { successResponse, errorResponse } from "../helpers/response.js";

import { uploadMultiple, getFile } from "../middleware/upload.middleware.js";

import { adminOnly, userAndAdmin } from "../middleware/roles.middleware.js";

import {
  createProductValidation,
  handleValidationErrors,
} from "../validators/product.validator.js";

const router = express.Router();

/* =====================================================
   UPDATE PRODUCT
===================================================== */

router.put(
  "/:id",
  adminOnly,
  uploadMultiple,
  createProductValidation,
  handleValidationErrors,

  async (req, res) => {
    try {
      const existingProduct = await Product.findById(req.params.id);

      if (!existingProduct) {
        return errorResponse(
          res,
          404,
          req.t("noProducts") || "Product not found",
        );
      }

      // Prepare update data
      const updateData = {};

      // Update title
      if (req.body.title !== undefined) {
        updateData.title = req.body.title;
      }

      // Update price
      if (req.body.price !== undefined) {
        updateData.price = Number(req.body.price);
      }

      // Update category
      if (req.body.category !== undefined) {
        updateData.category = req.body.category;
      }

      // Update stock
      if (req.body.countInStock !== undefined) {
        updateData.countInStock = Number(req.body.countInStock);
      }

      // Update description
      if (req.body.description !== undefined) {
        updateData.description = req.body.description;
      }

      // Handle image upload
      let imageURLs = [];

      if (req.files && req.files.length > 0) {
        imageURLs = req.files.map((file) => getFile(req, file.filename));
      }

      // Update images only when new images are uploaded
      if (imageURLs.length > 0) {
        if (req.body.replaceImages === "true") {
          // Replace old images
          updateData.images = imageURLs;
        } else {
          // Add new images to existing images
          updateData.images = [...existingProduct.images, ...imageURLs];
        }
      }

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      ).populate("category");

      return successResponse(
        res,
        "Product updated successfully",
        200,
        updatedProduct,
      );
    } catch (error) {
      console.error("Update Product Error:", error);

      return errorResponse(
        res,
        500,
        error.message || req.t("internalServerError"),
      );
    }
  },
);

/* =====================================================
   CREATE PRODUCT
===================================================== */

router.post(
  "/",
  adminOnly,
  uploadMultiple,
  createProductValidation,
  handleValidationErrors,

  async (req, res) => {
    try {
      let imageURLs = [];

      // Handle images
      if (req.files && req.files.length > 0) {
        imageURLs = req.files.map((file) => getFile(req, file.filename));
      }

      // Create product
      const newProduct = new Product({
        title: req.body.title,
        price: Number(req.body.price),
        category: req.body.category,
        countInStock: Number(req.body.countInStock),
        description: req.body.description,
        images: imageURLs,
      });

      // Save product
      const savedProduct = await newProduct.save();

      // Populate category
      await savedProduct.populate("category");

      return successResponse(
        res,
        "Product created successfully",
        201,
        savedProduct,
      );
    } catch (error) {
      console.error("Create Product Error:", error);

      return errorResponse(
        res,
        500,
        error.message || req.t("internalServerError"),
      );
    }
  },
);

/* =====================================================
   GET ALL PRODUCTS
===================================================== */

router.get("/", userAndAdmin, async (req, res) => {
  try {
    // Search
    const search = req.query.search || "";

    // Category
    const categoryID = req.query.categoryID;

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    // Filter
    const filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by category
    if (categoryID) {
      filter.category = categoryID;
    }

    // Get products
    const productsList = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(limit);

    // Total products
    const totalCount = await Product.countDocuments(filter);

    // Total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Pagination metadata
    const sharedDataResponse = {
      search,
      categoryID,
      page,
      limit,
      totalPages,
      totalProducts: totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // No products
    if (productsList.length === 0) {
      return successResponse(
        res,
        req.t("noProducts") || "No products found",
        200,
        [],
        null,
        sharedDataResponse,
      );
    }

    // Success
    return successResponse(
      res,
      "Products fetched successfully",
      200,
      productsList,
      null,
      sharedDataResponse,
    );
  } catch (error) {
    console.error("Get Products Error:", error);

    return errorResponse(
      res,
      500,
      error.message || req.t("internalServerError"),
    );
  }
});

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const foundProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      },
    ).populate("category");

    if (!foundProduct) {
      return errorResponse(
        res,
        404,
        req.t("noProducts") || "Product not found",
      );
    }

    return successResponse(
      res,
      "Product fetched successfully",
      200,
      foundProduct,
    );
  } catch (error) {
    console.error("Get Single Product Error:", error);

    return errorResponse(
      res,
      500,
      error.message || req.t("internalServerError"),
    );
  }
});

/* =====================================================
   DELETE PRODUCT
===================================================== */

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return errorResponse(
        res,
        404,
        req.t("noProducts") || "Product not found",
      );
    }

    return successResponse(
      res,
      "Product deleted successfully",
      200,
      deletedProduct,
    );
  } catch (error) {
    console.error("Delete Product Error:", error);

    return errorResponse(
      res,
      500,
      error.message || req.t("internalServerError"),
    );
  }
});

export default router;
