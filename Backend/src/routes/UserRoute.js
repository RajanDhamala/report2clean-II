import { Router } from "express";

import { LoginUser,RegisterUser,LogoutUser,GetUser,UserAuthencation,
ChangePassword,updateProfile,GetNotificationConfig ,UpdateNotifcation,
GetReportsStatus,GetNotifications,SetNotificationsRead,markAllAsRead} from "../controller/UserController.js";

import AuthUser from "../middleware/UserMiddle.js";
import uploadMiddleware from '../middleware/ImgMiddle.js'



const UserRouter=Router()

UserRouter.get('/',(req,res)=>{
    console.log("hitting the user route")
    res.send("hello dirty fellow form user router")
})

UserRouter.post('/register',RegisterUser)

UserRouter.post('/Login',LoginUser)

UserRouter.get('/logout',AuthUser,LogoutUser)

UserRouter.get('/profile',AuthUser,GetUser)

UserRouter.post('/authencation',AuthUser, uploadMiddleware('uploads').fields([
    { name: 'idImage', maxCount: 1 },
    { name: 'selfieImage', maxCount: 1 },
  ]),UserAuthencation)

UserRouter.post('/change-pswd',AuthUser,ChangePassword)
UserRouter.post('/update-profile',AuthUser,updateProfile)

UserRouter.get('/noti-config',AuthUser,GetNotificationConfig)

UserRouter.post('/edit-config',AuthUser,UpdateNotifcation)

UserRouter.get('/urs-reports',AuthUser,GetReportsStatus)

UserRouter.get('/notifications',AuthUser,GetNotifications)

UserRouter.post('/notifications',AuthUser,SetNotificationsRead)

UserRouter.get('/read-all/:notiId',AuthUser,markAllAsRead)

export default UserRouter