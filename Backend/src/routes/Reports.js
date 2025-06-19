import { Router } from "express";

const ReportRouter=Router()

ReportRouter.get('/',(req,res)=>{
    console.log("event report section")
    return res.send("cahl beh no event report")
})

export default ReportRouter