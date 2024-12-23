import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerCustomer = asyncHandler(async (req, res) => {
  let address = req.body.address;
  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch (error) {
      throw new ApiError(400, "Invalid Address Format");
    }
  }

  console.log(req.body);
  const {
    userName,
    displayName,
    email,
    password,
    phoneNumber,
    occupation,
    dob,
  } = req.body;

  const { street, city, state, zipCode, country } = address;

  if (
    [userName, displayName, email, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  // Check if the user with the username or email already exists
  const existedUser = await Customer.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  let avatarUrl =
    "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png"; // Replace with your default Cloudinary URL

  if (req.files?.avatar?.[0]?.path) {
    const avatarLocalPath = req.files.avatar[0].path;

    try {
      const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
      if (uploadedAvatar && uploadedAvatar.url) {
        avatarUrl = uploadedAvatar.url;
      }
    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      throw new ApiError(500, "An error occurred while uploading the avatar");
    }
  }

  const customer = await Customer.create({
    userName: userName.toLowerCase(), // Ensure userName is stored in lowercase
    displayName,
    avatar: avatarUrl, // Use the default avatar URL or the uploaded one
    email,
    phoneNumber,
    password,
    address: {
      street,
      city,
      state,
      zipCode,
      country,
    },
    dob,
    occupation,
  });

  const createdCustomer = await Customer.findById(customer._id).select(
    "-password -refreshToken"
  );
  if (!createdCustomer) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdCustomer, "User registered successfully")
    );
});

export { registerCustomer };
