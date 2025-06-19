import {Router } from "express";
import { AdminLogin } from "../controller/AdminController.js";

const AdminRouter=Router()

AdminRouter.get('/',(req,res)=>{
    console.log("hitting the admin routes")
    return res.send("reply from admin bebs")
})

AdminRouter.get('/login',AdminLogin)


export default AdminRouter