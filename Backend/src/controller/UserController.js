import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../schema/User.js'
import bcrypt from "bcrypt";
import { CreateAccessToken,CreateRefreshToken } from "../utils/Tokens.js";

const RegisterUser = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNo, password } = req.body;
  console.log('hello',req.body)

  if (!fullname || !email || !phoneNo || !password) {
    throw new ApiError(400, "Please add all the form details");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      fullname,
      email,
      phone_no: phoneNo,
      password: hashedPassword,
    });

    return res.send(new ApiResponse(201, "User created successfully", newUser));
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      throw new ApiError(400, "User is already registered with this email no");
    }
    throw new ApiError(500, "Something went wrong");
  }
});

const LoginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
  console.log("payload:",req.body)
    if(!email || !password){
        throw new ApiError(400,'please enter the email and password')
    }
    const existingUser=await User.findOne({email:email}).select("fullname email _id password") 
    if(!existingUser)throw new ApiError(404,'invalid credntials')
    const isMatch=await bcrypt.compare(password,existingUser.password)
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    const newAccesstoken=CreateAccessToken(existingUser)
    const newRefreshtoken=CreateRefreshToken(existingUser)
    const currentUser={
      username:existingUser.fullname,
      _id:existingUser._id,
    }

res.cookie('accessToken', newAccesstoken, {
  httpOnly: true,
  maxAge: 10 * 60 * 1000,
});

res.cookie('refreshToken', newRefreshtoken, {
  httpOnly: true,
  maxAge: 10 * 60 * 1000,
});

res.cookie('currentUser',currentUser,{
   httpOnly: true,
})
return res.send(new ApiResponse(200,'User logged in succesfully',null))
})

const LogoutUser=asyncHandler(async(req,res)=>{
  const user=req.user;
  console.log("someone is logging out",user)
  if(!req.user){
    throw new ApiError(400,'unauthorized req')
  }
res.clearCookie("accessToken", {
  httpOnly: true,
  sameSite: "strict",
});

res.clearCookie("refreshToken", {
  httpOnly: true,
  sameSite: "strict",
});
res.clearCookie('currentUser',{
   httpOnly: true,
},)

return res.send(new ApiResponse(200, 'User logged out successfully', null));
})

const GetUser=asyncHandler(async(req,res)=>{
    const user=req.user

    if(!user){
      throw new ApiError(400,'unauthorized access denied')
    }
    const existingUser=await User.findOne({email:user.email})
    if(!existingUser)throw new ApiError(400,"user doesn't exist")
      return res.send(new ApiResponse(200,'fetched user profile',existingUser))
})

export{
    RegisterUser,
    LoginUser,LogoutUser,GetUser
}