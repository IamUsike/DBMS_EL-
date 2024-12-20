import mongoose, { Schema } from "mongoose";
import {
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "./utils/userUtils.js";

const testimonialsSchema=new Schema(
    {
        propertyId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Property',
            required:true,
        },
        customerName:{
            type:String,
            required:true,

        },
        profession: {
            type: String,
            required: [true, "Field Cannot be empty"],
          },
          customerDescription:{
            type:String,
            required: [true, "Field Cannot be empty"],
          },
          customerSatisfaction:{
            type: String, 
            enum: ['Very Satisfied', 'Satisfied', 'Dissatisfied', 'Neutral'], 
            required: true,
          },
          customerId:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'customer'
          },
    },
    {timestamps:true}
);

export const Testimonial = mongoose.model('Testimonial', testimonialsSchema);