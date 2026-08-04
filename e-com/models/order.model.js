import mongoose from "mongoose";
import {baseSchemaPlugin } from "../plugins/baseSchema.plugin.js"

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot be more than 100"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be less than 0"],
      max: [1000000, "Price cannot be more than 1,000,000"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
        message: "Invalid order status",
      },
      default: "pending",
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be less than 0"],
      max: [10000000, "Total price cannot be more than 10,000,000"],
    },
  },
  {
    timestamps: true,
  },
);


orderSchema.plugin(baseSchemaPlugin);

// Calculate total price
orderSchema.methods.calculateTotalPrice = function () {
  return this.orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

// Before saving order
orderSchema.pre("save", function (next) {
  if (this.isModified("orderItems")) {
    this.totalPrice = this.calculateTotalPrice();
  }

  next();
});

// Create Order model
const orderModel = mongoose.model("Order", orderSchema);

export { orderModel };
