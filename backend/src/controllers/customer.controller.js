import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerCustomer = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    userName,
    displayName,
    email,
    password,
    phoneNumber,
    occupation,
    dob,
    address,
  } = req.body;

  const { street, city, state, zipCode, country } = address;

  if (
    [userName, displayName, email, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required");
  }

  //checking if the user with the username or email already exists
  const existedUser = await Customer.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  //taking the avatar using multer ||
  // store it locally in the beginning, upload it to multer and then delete
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(req.files?.avatar[0].path);
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "An error occurred while updating the avatar");
  }

  const customer = await Customer.create({
    userName: userName.toLowerCase(), // Ensure userName is stored in lowercase
    displayName,
    avatar: avatar.url, // Assuming avatar.url is the correct URL from the image upload
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
