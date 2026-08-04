import mongoose from "mongoose";
import { baseSchemaPlugin } from "../plugins/baseSchema.plugin.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minLength: [2, "Product name must be at least 2 characters"],
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [5, "Description must be at least 5 characters"],
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },

    images: {
      type: [String],
      default: [],
    },

    countInStock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
      max: [99999, "Stock cannot exceed 99999"],
    },

    rating: {
      average: {
        type: Number,
        default: 5,
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot be greater than 5"],
      },

      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },

    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// Apply base schema plugin
productSchema.plugin(baseSchemaPlugin);

// Create Product model
const Product = mongoose.model("Product", productSchema);

// Default export
export default Product;
