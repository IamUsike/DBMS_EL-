import mongoose, { Schema } from "mongoose";
import {
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "./utils/userUtils.js";

const customerSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, //cloudinary URL
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (v) {
          // Add regex for password strength (e.g., must contain numbers, special chars, etc.)
          return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
        },
        message:
          "Password must contain at least one number, one letter, and one special character",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: "Invalid phone number format",
      },
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (v) {
          return v <= new Date(); // Ensures DOB is not in the future
        },
        message: "Date of birth cannot be in the future",
      },
    },
    occupation: {
      type: String,
      required: [true, "Field Cannot be empty"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

customerSchema.methods.isPasswordCorrect = async function (password) {
  return await isPasswordCorrect(password, this.password);
};

customerSchema.methods.generateAccessToken = function () {
  return generateAccessToken(this._id);
};

customerSchema.methods.generateRefreshToken = function () {
  return generateRefreshToken(this._id);
};
export const Customer = mongoose.model("Customer", customerSchema);
