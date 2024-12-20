import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
            console.log("MONGODB connection error", error.message);
            process.exit(1); 
  }
};

export default connectDB;