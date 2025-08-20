import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import Report from "../schema/Report.js";


const AdminLogin=asyncHandler (async(req,res)=>{
    console.log("her is admin login hai")
    return res.send(new ApiResponse(201,'failed to creter usr',null))
})

const UpdateStatus=asyncHandler(async(req,res)=>{
    const {status,report_id}=req.params;
    if(!status || !report_id)throw new ApiError(404,'please add all fields in req')
    const existingReport=await Report.findOne({_id:report_id}).select('status');
    if(!existingReport)throw new ApiError(404,'report doesnot exist')
    existingReport.status=`${status}`
    await existingReport.save()
    res.send(new ApiResponse(401,'status updated',existingReport))
})

const DeleteReport=asyncHandler(async(req,res)=>{
    const {report_id}=req.params;
    if(!report_id)throw new ApiError(404,'please fill all details')
    const existing_report=await Report.findOneAndDelete({_id:report_id})
    if (!existing_report)throw new ApiError(404,'the report doenot exist')
   return res.send(new ApiResponse(200, 'Report deleted successfully'));
})

const ViewReport=asyncHandler(async(req,res)=>{
    const {report_id}=req.params;
    if(!report_id)throw new ApiError(400,'please fill the report id')
    const report=await Report.findOne({_id:report_id}).populate('fullname')
    if(!report)throw new ApiError(404,'the report doenot exist')
    return res.status(200).send(new ApiResponse(200,'fetehed data finally',report))
})

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

  return res
    .status(200)
    .send(new ApiResponse(200, 'Fetched reports successfully', {
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      reports
    }));
});

export {
    AdminLogin,UpdateStatus,DeleteReport,ViewReport,SeeAllReports
}