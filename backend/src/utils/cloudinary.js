import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {resource_type:'auto'})
    console.log(`file has been uploaded successfully to cloudinary`, response.url)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removes the locally saved temp
    //file as the upload operation failed
    return null;
  }
};

const localFilePath = "C:\\Users\\sathw\\OneDrive\\Desktop\\sign.jpg";
uploadOnCloudinary(localFilePath)

export {uploadOnCloudinary}
