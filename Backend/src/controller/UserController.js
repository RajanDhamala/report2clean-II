import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../schema/User.js'
import bcrypt from "bcrypt";
import { CreateAccessToken,CreateRefreshToken } from "../utils/Tokens.js";
import UserConfig from '../schema/UserConfigs.js'
import Report from '../schema/Report.js'
import { RegisterMail,VerificationReport } from "../utils/MailConfig.js";
import Notification from "../schema/Notification.js";

const RegisterUser = asyncHandler(async (req, res) => {
  console.log("registerning usr")
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
  await RegisterMail(newUser.email,newUser.fullname)
    return res.send(new ApiResponse(201, "User created successfully", newUser));
  } catch (err) {
  console.error("Registration error:", err); 

  if (err.code === 11000 && err.keyPattern?.email) {
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


const isProd = process.env.NODE_ENV === "production";

res.cookie("accessToken", newAccesstoken, {
  httpOnly: true,               // JS cannot access token
  secure: isProd,               // HTTPS only in production
  sameSite: "strict",           // prevents CSRF
  maxAge: 10 * 60 * 1000,       // 10 minutes
  path: "/",
});

res.cookie("refreshToken", newRefreshtoken, {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

res.cookie("currentUser", JSON.stringify(currentUser), {
  httpOnly: false,              // frontend JS can read
  secure: isProd,               // HTTPS only in production
  sameSite: "lax",              // allows sending with same-site requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});


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
    console.log(req.user._id)
    const existingUser=await User.findOne({_id:user._id}).select("_id email phone_no fullname isAuthencated")
    if(!existingUser)throw new ApiError(400,"user doesn't exist")
      return res.send(new ApiResponse(200,'fetched user profile',existingUser))
})

const UserAuthencation = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(400, 'Unauthorized access');

  const { idImage, selfieImage } = req.files;
  const { location } = req.body;

  if (!idImage || !selfieImage || !location) {
    return res.status(401).send(new ApiResponse(401, 'Please fill all form fields correctly'));
  }

  console.log('Received location:', location);

  let latitude, longitude;
  try {
    if (typeof location === 'string') {
      if (location.startsWith('[') && location.endsWith(']')) {
        const parsed = JSON.parse(location);
        [latitude, longitude] = parsed;
      } 
    } else if (Array.isArray(location)) {
      [latitude, longitude] = location;
    } else {
      throw new Error('Invalid location format');
    }
  } catch (err) {
    console.error('Location parsing error:', err.message);
    throw new ApiError(400, 'Invalid coordinates format. Use "lat,lng" or [lat,lng]');
  }

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    throw new ApiError(400, 'Invalid coordinates format or out of bounds');
  }
  console.log('Parsed coordinates:', { latitude, longitude });

  const existingUser = await User.findOne({ _id: req.user._id });
  if (!existingUser) throw new ApiError(400, 'User does not exist');

  existingUser.location = {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
  existingUser.gov_id = idImage.path;
  existingUser.profilePic = selfieImage.path;
   existingUser.isAuthencated = true;

  const savePromise = existingUser.save();
const mailPromise = VerificationReport(req.user.email, req.user.name);
await Promise.all([savePromise, mailPromise]);

  res.send(new ApiResponse(201, 'User authenticated successfully', existingUser));
});


const ChangePassword = asyncHandler(async (req, res) => {
  const { oldPasswd, newPasswd } = req.body;

  const userss = await User.findOne({ _id: req.user._id }).select("password");
  const isMatch = await bcrypt.compare(oldPasswd, userss.password);

  console.log("Password match:", isMatch);

  if (!isMatch) throw new ApiError(400, "Invalid credentials");

  const hashedPassword = await bcrypt.hash(newPasswd, 10);
  userss.password = hashedPassword;
  await userss.save();

  return res.status(200).json({ message: "Password has been changed successfully" });
});


const updateProfile = asyncHandler(async (req, res) => {
  const { newname, newPhone, newEmail } = req.body;

  const existingUser = await User.findById(req.user._id);
  if (!existingUser) throw new ApiError(400, 'User does not exist');

  if (newname !== undefined && newname.trim() !== '') {
    existingUser.fullname = newname;
  }
  if (newPhone !== undefined && newPhone !== '') {
    existingUser.phone_no = newPhone;
  }
  if (newEmail !== undefined && newEmail.trim() !== '') {
    existingUser.email = newEmail;
  }
  await existingUser.save();
  res.status(200).send(new ApiResponse(200, 'User profile updated successfully'));
});


const UpdateNotifcation=asyncHandler(async(req,res)=>{
    const {nearbyAlerts,emergencyNoti,emailNotification,pushNotifications}=req.body
    const existingUser=await UserConfig.findOne({ownedby:req.user._id})

    if(!existingUser)throw new ApiError(400,'user donot exist in db')
      existingUser.emailNotification=emailNotification;
      existingUser.nearbyAlerts=nearbyAlerts
      existingUser.pushNotifications=pushNotifications
      existingUser.emergencyNoti=emergencyNoti
      await existingUser.save()
return res.send(new ApiResponse(201,'updated the notification'))
})


const GetNotificationConfig = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  let config = await UserConfig.findOne({ ownedby: req.user._id });
  if (!config) {
    config = await UserConfig.create({
      ownedby: req.user._id,
      emailNotification: false,
      nearbyAlerts: true,
      pushNotifications: true,
      emergencyNoti: false
    });
  }
  res.status(200).send(new ApiResponse(200, "Notification config fetched", config));
});


const GetReportsStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
console.log(req.user._id)
  if (!userId) throw new ApiError(401, 'Unauthorized access');

  const userReports = await Report.find({ reported_by: userId })
    .select('reported_by _id description address status urgency createdAt')
    .populate({ path: 'reported_by', select: 'fullname' }).limit(12);

  if (userReports.length === 0) {
    throw new ApiError(404, 'You have no reports to view');
  }

  return res.status(200).send(
    new ApiResponse(200, 'Fetched user reports successfully', userReports)
  );
});




const GetNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, 'Please provide valid cookies');

  const notificationDoc = await Notification.findOne({ user_id: userId });

  if (!notificationDoc || !notificationDoc.notifications?.length) {
    return res.send(new ApiResponse(200, 'No notifications', []));
  }

  // Sort notifications by time descending and pick latest 5
  const latestNotifications = notificationDoc.notifications
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  return res.send(new ApiResponse(200, 'Fetched latest notifications', latestNotifications));
});


const SetNotificationsRead=asyncHandler(async(req,res)=>{
  const {mainId,subId}=req.body;
  console.log(mainId,subId,"this is from the main req")
  if(!mainId || !subId)throw new ApiError(400,'please fill the fields in req')
  // const updateNotification=await Notification.findOneAndUpdate({
  //   _id:mainId,
  //   'notifications._id': subId
  // }, {
  //   $set: { 'notifications.$.isReaded': true }
  // }, {
  //   new: true
  // });
const updateNotification = await Notification.findOneAndUpdate(
  {
   user_id: req.user._id,
  "notifications._id": subId
  },
  {
    $set: { "notifications.$.isReaded": true }
  },
  { new: true }
);
if(updateNotification){
    return res.status(200).json({
    message: 'Notification marked as read',
    notification: updateNotification
  });
}else{
  return res.send("error"
  )
}

});


const markAllAsRead = asyncHandler(async (req, res) => {
  const updateNotification = await Notification.findOneAndUpdate(
    { user_id: req.user._id },                         // find doc by user_id
    { $set: { "notifications.$[].isReaded": true } },  // set all isReaded = true
    { new: true }                                      // return updated doc
  );

  if (!updateNotification) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

export{
    RegisterUser,
    LoginUser,LogoutUser,GetUser,UserAuthencation,ChangePassword,updateProfile,UpdateNotifcation,
    GetNotificationConfig,GetReportsStatus,GetNotifications,
  SetNotificationsRead,markAllAsRead}
