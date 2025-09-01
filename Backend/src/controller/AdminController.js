import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import Report from "../schema/Report.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN || '5m'; // 10 minutes

const AdminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ApiError(400, "Please add username and password");

console.log(username,password,process.env.USERNAME)
  if (username ==process.env.USERNAME && password ==process.env.PASSWORD) {
    const user = { _id:req.user._id, username }; // Add _id here

    const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

        res.cookie("adminToken", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 1000,
        path: "/",});

    return res.send({ status: 200, message: "Admin logged in successfully" });
  }

  return res.send({ status: 401, message: "Invalid credentials" });
});
// ------------------- Update Status -------------------
const UpdateStatus = asyncHandler(async (req, res) => {
    const { status, report_id } = req.params;
    console.log("status:",status,"reortid:",report_id)
    if (!status || !report_id) throw new ApiError(404, 'Please add all fields in request');
    
    const existingReport = await Report.findOne({ _id: report_id }).select('status');
    if (!existingReport) throw new ApiError(404, 'Report does not exist');
    
    existingReport.status = status;
    await existingReport.save();

    // return 200 for success
    res.status(200).send(new ApiResponse(200, 'Status updated successfully', existingReport));
});

// ------------------- Delete Report -------------------
const DeleteReport = asyncHandler(async (req, res) => {
    const { report_id } = req.params;
    if (!report_id) throw new ApiError(404, 'Please provide report id');

    const existing_report = await Report.findOneAndDelete({ _id: report_id });
    if (!existing_report) throw new ApiError(404, 'Report does not exist');

    return res.status(200).send(new ApiResponse(200, 'Report deleted successfully'));
});

// ------------------- View Report -------------------
const ViewReport = asyncHandler(async (req, res) => {
    const { report_id } = req.params;
    if (!report_id) throw new ApiError(400, 'Please provide report id');

    const report = await Report.findOne({ _id: report_id }).populate('fullname');
    if (!report) throw new ApiError(404, 'Report does not exist');

    return res.status(200).send(new ApiResponse(200, 'Fetched report successfully', report));
});

// ------------------- See All Reports -------------------
const SeeAllReports = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const totalReports = await Report.countDocuments();

    const reports = await Report.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: 'fullname',
                foreignField: '_id',
                as: 'fullname'
            }
        },
        { $unwind: '$fullname' }
    ]);

    if (!reports.length) throw new ApiError(404, 'No reports available');

    return res.status(200).send(new ApiResponse(200, 'Fetched reports successfully', {
        totalReports,
        totalPages: Math.ceil(totalReports / limit),
        currentPage: page,
        reports
    }));
});
export {
    AdminLogin,UpdateStatus,DeleteReport,ViewReport,SeeAllReports
}
