import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { baseSchemaPlugin } from "../plugins/baseSchema.plugin.js";



const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.plugin(baseSchemaPlugin);  

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }
 try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

// Method to remove the password field when converting the user document to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
    return userObject;
};









userSchema.plugin(baseSchemaPlugin);
const User = mongoose.model("User", userSchema);

export default User;
