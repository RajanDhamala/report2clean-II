import { Router } from "express";
import { LoginUser,RegisterUser,LogoutUser,GetUser } from "../controller/UserController.js";
import AuthUser from "../middleware/UserMiddle.js";



const UserRouter=Router()

UserRouter.get('/',(req,res)=>{
    console.log("hitting the user route")
    res.send("hello dirty fellow form user router")
})

UserRouter.post('/register',RegisterUser)

UserRouter.post('/Login',LoginUser)

UserRouter.get('/logout',AuthUser,LogoutUser)

UserRouter.get('/profile',AuthUser,GetUser)


export default UserRouter