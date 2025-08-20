import {Router } from "express";
import { AdminLogin,UpdateStatus } from "../controller/AdminController.js";

const AdminRouter=Router()

AdminRouter.get('/',(req,res)=>{
    console.log("hitting the admin routes")
    return res.send("reply from admin bebs")
})

AdminRouter.get('/login',AdminLogin)
AdminRouter.get('/update-status/:status/:report_id',UpdateStatus)

export default AdminRouter