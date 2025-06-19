import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'


const CreateReport=asyncHandler(async(req,res)=>{
    const user=req.user;
    const {description,location,coordinates:[]}=req.body
    if(!user)throw new ApiError(400,'unauthorized access')
        if(!description || !location || !coordinates){
            throw new ApiError(400,'please fill all form details')
        }
    
})