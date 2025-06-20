import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import Report from '../schema/Report.js'

const CreateReport = asyncHandler(async (req, res) => {
  const user = req.user;
  const uploadedImages = req.files;
  const { description, location, coordinates } = req.body;

  if (!user) throw new ApiError(401, 'Unauthorized access');
  if (!description || !coordinates) {
    throw new ApiError(400, 'Please fill all form details');
  }

  const [latitude, longitude] = coordinates.split(',').map(Number);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new ApiError(400, 'Invalid coordinates format. Use "lat,lng"');
  }

  const urls = uploadedImages.map((file) => file.path);

  const newReport = await Report.create({
    reported_by: user._id,
    description,
    location: location || 'Unknown', 
    coordinates: { latitude, longitude },
    images: urls,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Event report created successfully', newReport));
});

const seeurReorts=asyncHandler(async(req,res)=>{
  const user=req.user;
  if(!user)throw new ApiError(400,'unauthorized acess denied')
    const userReports = await Report.find({ reported_by: user._id }).populate({
  path: 'reported_by',
  select: 'fullname', 
})

  console.log(userReports)
  return res.send(new ApiResponse(200,'fetched user events',userReports))
})

export {
    CreateReport,
    seeurReorts
}