import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import Report from '../schema/Report.js'
import User from "../schema/User.js";
import { ReportSubmission } from "../utils/MailConfig.js";
import Notification from "../schema/Notification.js";

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
    address: location || 'Unknown',
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    },
    images: urls
  });

  await Notification.findOneAndUpdate(
    { user_id: user._id },
    {
      $push: {
        notifications: {
          message: `New report created: ${newReport.description}`,
          type: 'event',
          link: `/report/${newReport._id}`
        }
      }
    },
    { upsert: true, new: true }
  );

  await ReportSubmission(user.email, user.name, newReport.description, newReport.address);
  res
    .status(201)
    .json(new ApiResponse(201, 'Event report created successfully', newReport));
});


const seeurReorts = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(400, 'Unauthorized access denied');

  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const totalReports = await Report.countDocuments({});

  const reports = await Report.find({})
    .populate({ path: 'reported_by', select: 'fullname' })
    .sort({ createdAt: -1 }) // Latest first
    .skip(skip)
    .limit(limit);

  return res.send(
    new ApiResponse(200, "Fetched reports", {
      reports,
      totalReports,
    })
  );
});



const GetLocalAlerts=asyncHandler(async(req,res)=>{
  const user=req.user
  const {lat,long,radius}=req.params;
  // if(!user)throw new ApiError(400,'unauthorized acess denied')
  if(!lat || !long ||!radius)throw new ApiError(400,'please fill all the fileds')

     const latNum = parseFloat(lat);
  const longNum = parseFloat(long);
  const radiusMeters = parseFloat(radius) * 1000; // Convert km to meters

    const users=await Report.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longNum), parseFloat(latNum)]
          },
          $maxDistance: radiusMeters
        }
      }
    }).populate("reported_by", "fullname");

    console.log(res)
    return res.send(new ApiResponse(200,'fetcehd data',users))
})


const ViewReports=asyncHandler(async(req,res)=>{
  const {report_id}=req.params;
  if (!report_id)throw new ApiError(400,'please add event id also')
    const existingReport=await Report.findOne({_id:report_id})
  console.log(existingReport)
  if(!existingReport)throw new ApiError(400,'event not fould')
    res.send(new ApiResponse(201,'got the report info',existingReport))
})


const getUserReportDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const user = await User.findById(req.user._id).select("location");
  if (!user || !user.location?.coordinates) {
    throw new ApiError(400, "User location not set correctly");
  }

  const userCoords = user.location.coordinates;

  // --- Generate last 6 months
  const sixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    sixMonths.push({
      key: `${date.getFullYear()}-${date.getMonth() + 1}`,
      name: monthNames[date.getMonth()],
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  // --- Use $facet to do both groupings in one geoNear
  const geoNearResults = await Report.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: userCoords },
        distanceField: "distance",
        maxDistance: 1000,
        spherical: true,
        key: "location",
        query: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            $lte: now,
          },
        },
      },
    },
    {
      $facet: {
        eventsCount: [
          {
            $group: {
              _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
        ],
        monthlyTrend: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                status: "$status",
              },
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const nearbyCountMap = {};
  const trendMap = {};

  const eventsCountRaw = geoNearResults[0]?.eventsCount || [];
  const trendRaw = geoNearResults[0]?.monthlyTrend || [];

  for (const row of eventsCountRaw) {
    const key = `${row._id.year}-${row._id.month}`;
    nearbyCountMap[key] = row.count;
  }

  for (const item of trendRaw) {
    const key = `${item._id.year}-${item._id.month}`;
    if (!trendMap[key]) {
      trendMap[key] = { reports: 0, resolved: 0 };
    }
    trendMap[key].reports += item.count;
    if (item._id.status === "completed") {
      trendMap[key].resolved += item.count;
    }
  }

  const eventsInAreaData = sixMonths.map(({ key, name }) => ({
    name,
    events: nearbyCountMap[key] || 0,
  }));

  const monthlyTrendData = sixMonths.map(({ key, name }) => ({
    month: name,
    reports: trendMap[key]?.reports || 0,
    resolved: trendMap[key]?.resolved || 0,
  }));

  // --- Weekly Activity (same as before)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyRaw = await Report.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  const dayMap = {
    1: "Sun",
    2: "Mon",
    3: "Tue",
    4: "Wed",
    5: "Thu",
    6: "Fri",
    7: "Sat",
  };

  const initialWeekly = {
    Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0,
  };

  for (const item of weeklyRaw) {
    const dayName = dayMap[item._id];
    if (dayName) initialWeekly[dayName] = item.count;
  }

  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyActivityData = orderedDays.map((day) => ({
    day,
    activity: initialWeekly[day],
  }));

  return res.status(200).json(
    new ApiResponse(200, "Fetched dashboard report stats", {
      eventsInAreaData,
      weeklyActivityData,
      monthlyTrendData,
    })
  );
});




export {
    CreateReport,
    seeurReorts,
    GetLocalAlerts,ViewReports,getUserReportDashboardStats
}