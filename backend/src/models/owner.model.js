import mongoose, { Schema } from "mongoose";
import {
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "./utils/userUtils.js";

const ownerSchema = new Schema(
    {
      userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true,
      },
      displayName: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String, // URL from Cloudinary or other image hosting
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
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(v);
          },
          message:
            "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character",
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
            return v <= new Date(); 
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
      PropertyCount: { type: Number, default: 0 },
      PropertiesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
      LicenseNumber: { type: String },
      RegistrationDate: { type: Date, default: Date.now },
      Status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
      Preferences: {
        PropertyType: [String], 
        Location: [String],     
      },
      EmergencyContact: {
        Name: { type: String },
        Relationship: { type: String },
        PhoneNumber: { type: String },
      },
    },
    { timestamps: true }  
  );

  ownerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hashPassword(this.password);
    next();
  });
  
  ownerSchema.methods.isPasswordCorrect = async function(password){
      return await isPasswordCorrect(password, this.password)
  }
  
  ownerSchema.methods.generateAccessToken = function () {
    return generateAccessToken(this._id);
  };
  
  ownerSchema.methods.generateRefreshToken = function () {
    return generateRefreshToken(this._id);
  };
  export const Owner=mongoose.model("Owner",ownerSchema)
  