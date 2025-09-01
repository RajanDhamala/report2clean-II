import { Router } from "express";
import uploadMiddleware from '../middleware/ImgMiddle.js'
import { CreateReport,seeurReorts,GetLocalAlerts,ViewReports,getUserReportDashboardStats,MapReport} from "../controller/ReportController.js";
import AuthUser from "../middleware/UserMiddle.js";
import { adminAuth } from "../middleware/AdminMiddle.js";
const ReportRouter=Router()

ReportRouter.get('/',(req,res)=>{
    console.log("event report section")
    return res.send("cahl beh no event report")
})

ReportRouter.post('/createReport',AuthUser,uploadMiddleware('/reports').array('images',5),CreateReport)
ReportRouter.get('/seereport',seeurReorts)
ReportRouter.get('/get/:lat/:long/:radius',adminAuth,GetLocalAlerts)
ReportRouter.get('/view/:report_id',ViewReports)
ReportRouter.get('/view-charts',AuthUser,getUserReportDashboardStats)



ReportRouter.get('/map/:lat/:long/:radius',AuthUser,MapReport)

export default ReportRouter
