import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'


const AdminLogin=asyncHandler (async(req,res)=>{
    console.log("her is admin login hai")
    return res.send(new ApiResponse(201,'failed to creter usr',null))
    // return throw new ApiError(200,'hug')
})

export {
    AdminLogin
}