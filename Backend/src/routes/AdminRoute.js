

import { Router } from "express";
import Report from "../schema/Report.js";
import User from "../schema/User.js";
import AuthUser from "../middleware/UserMiddle.js";
import asyncHandler from "../utils/AsyncHandler.js";
const AdminRouter = Router();
import { AdminLogin } from "../controller/AdminController.js"; 
import { adminAuth } from "../middleware/AdminMiddle.js";


// ------------------- SSR Admin Panel -------------------
AdminRouter.get("/", adminAuth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const status = req.query.status || "";
  const nearby = req.query.nearby === "true";

  const { reports, totalReports, totalPages, currentPage } = await SeeAllReportsInternal({
    page,
    status,
    nearby,
    userId: req.user._id,
    allUsers: true, // set false if you want only this user’s reports
  });

  res.render("admin", {
    username: req.user.username,
    reports,
    totalPages,
    currentPage,
    selectedStatus: status,
    nearby,
  });
});


AdminRouter.post("/loginme",AdminLogin)
// ------------------- API endpoints -------------------
AdminRouter.patch("/update-status/:status/:report_id",adminAuth, async (req, res) => {
  const { status, report_id } = req.params;
  const report = await Report.findByIdAndUpdate(report_id, { status }, { new: true });
  res.json({ success: true, report });
});

AdminRouter.delete("/report/:report_id",adminAuth, async (req, res) => {
  await Report.findByIdAndDelete(req.params.report_id);
  res.json({ success: true });
});

AdminRouter.patch("/status/:report_id",adminAuth,async(req,res)=>{
const {report_id}=req.params;
  const {status}=req.body;
  console.log(report_id,status)
  if(!report_id || !status)throw new Error(400,'invalid req')
  const existingrepo=await Report.findOne({_id:report_id})
  existingrepo.status=status;
  await existingrepo.save()
  return res.send({
    statusCode:200,
    message:"successfully changed status to",status
  })
})

AdminRouter.get("/login", asyncHandler(async (req, res) => {
  res.render("Login", { error: null });
}));



AdminRouter.get("/report/:ReportId", adminAuth, async (req, res) => {
  const reportId = req.params.ReportId;
  if (!reportId) return res.status(400).send("Report ID missing");
  const report = await Report.findById(reportId)
    .populate("reported_by", "fullname email") // optional: if you want user info
    .lean();
  if (!report) return res.status(404).send("Report not found");
  console.log("dad",report)

  // Render EJS with report details
  res.render("info", { report });
});

export default AdminRouter;

// ------------------- Helper -------------------
async function SeeAllReportsInternal({ page = 1, limit = 10, status = "", nearby = false, userId, allUsers = false }) {
  const skip = (page - 1) * limit;
  const filter = {};

  // S
  // tatus filter
  if (status && status !== "") filter.status = status;

  // Optional: user filter
  if (!allUsers && userId) filter.user = userId;

  // Nearby filter using $geoWithin
  if (nearby && userId) {
    const requestingUser = await User.findById(userId).lean();
    const coords = requestingUser?.location?.coordinates; // [lng, lat]

    if (coords && coords[0] !== 0 && coords[1] !== 0) {
      const radiusInRadians = 3 / 6378.1; // 3 km in radians
      filter.location = {
        $geoWithin: {
          $centerSphere: [coords, radiusInRadians],
        },
      };
    } else {
      console.log("Skipping nearby filter: invalid coordinates");
    }
  }

  console.log("Mongo filter:", filter);

  const totalReports = await Report.countDocuments(filter);
  const reports = await Report.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  console.log("Reports returned:", reports.length);


  return {
    reports,
    totalReports,
    totalPages: Math.ceil(totalReports / limit),
    currentPage: page,
  };
}

