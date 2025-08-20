import { Router } from "express";
import uploadMiddleware from '../middleware/ImgMiddle.js'
import { CreateReport,seeurReorts,GetLocalAlerts,ViewReports,getUserReportDashboardStats} from "../controller/ReportController.js";
import AuthUser from "../middleware/UserMiddle.js";
const ReportRouter=Router()

ReportRouter.get('/',(req,res)=>{
    console.log("event report section")
    return res.send("cahl beh no event report")
})

ReportRouter.post('/createReport',AuthUser,uploadMiddleware('/reports').array('images',5),CreateReport)
ReportRouter.get('/seereport',AuthUser,seeurReorts)
ReportRouter.get('/get/:lat/:long/:radius',GetLocalAlerts)
ReportRouter.get('/view/:report_id',ViewReports)
ReportRouter.get('/view-charts',AuthUser,getUserReportDashboardStats)

export default ReportRouter