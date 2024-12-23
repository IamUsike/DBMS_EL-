import {asyncHandler} from "../utils/asyncHandler.js"

const registerCustomer = asyncHandler(async (req, res)=>{
    res.status(200).json({
        message: "ok"
    })
})

export {registerCustomer}