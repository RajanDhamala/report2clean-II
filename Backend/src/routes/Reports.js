import { Router } from "express";
import uploadMiddleware from '../middleware/ImgMiddle.js'
import { CreateReport,seeurReorts } from "../controller/ReportController.js";
import AuthUser from "../middleware/UserMiddle.js";
const ReportRouter=Router()

ReportRouter.get('/',(req,res)=>{
    console.log("event report section")
    return res.send("cahl beh no event report")
})

ReportRouter.post('/createReport',AuthUser,uploadMiddleware('/reports').array('images',5),CreateReport)
ReportRouter.get('/seereport',AuthUser,seeurReorts)

export default ReportRouter