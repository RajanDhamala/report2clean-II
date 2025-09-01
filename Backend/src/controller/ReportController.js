import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import Report from '../schema/Report.js'
import User from "../schema/User.js";
import { ReportSubmission,NearbyReportAlert } from "../utils/MailConfig.js";
import Notification from "../schema/Notification.js";
import UserConfig from "../schema/UserConfigs.js";


const CreateReport = asyncHandler(async (req, res) => {
  const user = req.user;
  const uploadedImages = req.files;
  const { description, location, coordinates } = req.body;

  if (!user) throw new ApiError(401, "Unauthorized access");
  if (!description || !coordinates) throw new ApiError(400, "Please fill all form details");

  // Parse coordinates
  const [latitude, longitude] = coordinates.split(",").map(Number);
  if (isNaN(latitude) || isNaN(longitude))
    throw new ApiError(400, 'Invalid coordinates format. Use "lat,lng"');

  // Prepare uploaded image URLs
  const urls = uploadedImages.map((file) => file.path);

  // Create new report
  const newReport = await Report.create({
    reported_by: user._id,
    description,
    address: location || "Unknown",
    location: { type: "Point", coordinates: [longitude, latitude] },
    images: urls,
  });

  // Radius for nearby notifications (5km)
  const radiusMeters = 5000;

  // Find all nearby users (excluding the submitter)
  const nearbyUsers = await User.find({
    _id: { $ne: user._id },
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: radiusMeters,
      },
    },
    isBlocked: false,
    type: "user",
  });

  // Background processing: notifications + emails
  setImmediate(async () => {
    await Promise.all(
      nearbyUsers.map(async (u) => {
        try {
          // Fetch user configuration for alerts
          const userConfig = await UserConfig.findOne({ ownedby: u._id });

          // If user wants email notifications
          if (userConfig?.emailNotification) {
            // Call your email sending function
          //  await sendNearbyReportEmail({
           //   to: u.email,
            //  fullname: u.fullname,
           //   reporterName: user.fullname,
            //  reportDescription: newReport.description,
           //   reportAddress: newReport.address,
            //  reportLink: `/report/${newReport._id}`,
           // });
          }

          // If user wants nearby alerts in DB
          if (userConfig?.nearbyAlerts) {
            const notificationMessage = {
              message: `Report Near your Area: ${newReport.description}`,
              type: "event",
              link: `/report/${newReport._id}`,
              time: new Date(),
            };

            await Notification.findOneAndUpdate(
              { user_id: u._id },
              { $push: { notifications: notificationMessage } },
              { upsert: true, new: true }
            );
          }

          console.log(` Notification & email processed for ${u.email}`);
        } catch (err) {
          console.error(` Failed for user ${u.email}:`, err.message);
        }
      })
    );
  });

  // Respond immediately
  res.status(201).json(
    new ApiResponse(201, "Event report created successfully", newReport)
  );
});

const seeurReorts = asyncHandler(async (req, res) => {

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







// Route: /get/:lat/:long/:radius?status=&date=&radiusKm=



const GetLocalAlerts = asyncHandler(async (req, res) => {
  const { lat, long, radius } = req.params;
  const { status = "", dateRange = "", radiusKm: queryRadiusKm, mapLat, mapLong, mapZoom } = req.query;

  if (!lat || !long || !radius) throw new Error("Please provide lat, long, and radius");

  // Use query values if provided, otherwise URL params
  const latNum = queryRadiusKm ? parseFloat(req.query.lat) : parseFloat(lat);
  const longNum = queryRadiusKm ? parseFloat(req.query.long) : parseFloat(long);

  // Final radius (query overrides URL param)
  const finalRadiusKm = Math.min(
    Math.max(queryRadiusKm ? parseFloat(queryRadiusKm) : parseFloat(radius) || 2, 0.5),
    10
  );
  const radiusMeters = finalRadiusKm * 1000;

  // MongoDB geo query
  const filter = {
    location: {
      $geoWithin: {
        $centerSphere: [[longNum, latNum], radiusMeters / 6378100]
      }
    }
  };

  if (status) filter.status = status;

  if (dateRange) {
    const now = new Date();
    let startDate = new Date();
    if (dateRange === "today") startDate.setHours(0, 0, 0, 0);
    else if (dateRange === "3days") startDate.setDate(now.getDate() - 3);
    else if (dateRange === "week") startDate.setDate(now.getDate() - 7);
    else if (dateRange === "month") startDate.setMonth(now.getMonth() - 1);

    filter.createdAt = { $gte: startDate, $lte: now };
  }

  // Fetch reports
  const reports = await Report.find(filter)
    .populate("reported_by", "fullname")
    .sort({ createdAt: -1 })
    .limit(20);

  // Render EJS template with map & filters preserved
  res.render("localAlerts", {
    title: "Nearby Reports",
    reports,
    center: { lat: latNum, long: longNum },
    radiusKm: finalRadiusKm,
    selectedStatus: status,
    selectedDate: dateRange,
    mapLat: mapLat || latNum,
    mapLong: mapLong || longNum,
    mapZoom: mapZoom || 13
  });
});


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
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const user = await User.findById(req.user._id).select("location");
  if (!user || !user.location?.coordinates) {
    throw new ApiError(400, "User location not set correctly");
  }
  const userCoords = user.location.coordinates;

  //Lifetime contributions of logged-in user
  const [userTotal, userCompleted] = await Promise.all([
    Report.countDocuments({ reported_by: req.user._id }),
    Report.countDocuments({ reported_by: req.user._id, status: "completed" }),
  ]);

  //  Last 6 months for trend / eventsInArea
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

  // GeoNear for 2 km radius, past 1 year
  const geoNearResults = await Report.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: userCoords },
        distanceField: "distance",
        maxDistance: 2000,
        spherical: true,
        key: "location",
        query: { createdAt: { $gte: oneYearAgo, $lte: now } },
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

  const eventsCountRaw = geoNearResults[0]?.eventsCount || [];
  const trendRaw = geoNearResults[0]?.monthlyTrend || [];

  const eventsInAreaMap = {};
  for (const row of eventsCountRaw) {
    const key = `${row._id.year}-${row._id.month}`;
    eventsInAreaMap[key] = row.count;
  }

  const trendMap = {};
  for (const item of trendRaw) {
    const key = `${item._id.year}-${item._id.month}`;
    if (!trendMap[key]) trendMap[key] = { reports: 0, resolved: 0 };
    trendMap[key].reports += item.count;
    if (item._id.status === "completed") trendMap[key].resolved += item.count;
  }

  const eventsInAreaData = sixMonths.map(({ key, name }) => ({
    name,
    events: eventsInAreaMap[key] || 0,
  }));

  const monthlyTrendData = sixMonths.map(({ key, name }) => ({
    month: name,
    reports: trendMap[key]?.reports || 0,
    resolved: trendMap[key]?.resolved || 0,
  }));

  // 4️⃣ Weekly activity
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyRaw = await Report.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo, $lte: now } } },
    { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
  ]);

  const dayMap = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" };
  const initialWeekly = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  for (const item of weeklyRaw) {
    const dayName = dayMap[item._id];
    if (dayName) initialWeekly[dayName] = item.count;
  }
  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyActivityData = orderedDays.map((day) => ({ day, activity: initialWeekly[day] }));

  // 5️⃣ Local events summary for dashboard (total, completed, this month)
  const localSummary = await Report.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: userCoords },
        distanceField: "distance",
        maxDistance: 2000,
        spherical: true,
        key: "location",
      },
    },
    {
      $facet: {
        totalNearby: [{ $count: "count" }],
        completedNearby: [{ $match: { status: "completed" } }, { $count: "count" }],
        thisMonth: [{ $match: { createdAt: { $gte: startOfMonth, $lte: now } } }, { $count: "count" }],
      },
    },
  ]);

  const totalNearby = localSummary[0]?.totalNearby[0]?.count || 0;
  const completedNearby = localSummary[0]?.completedNearby[0]?.count || 0;
  const thisMonthNearby = localSummary[0]?.thisMonth[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(200, "Fetched dashboard report stats", {
      lifetimeContributions: {
        totalReports: userTotal,
        completedReports: userCompleted,
      },
      localEvents2km: {
        totalReports: totalNearby,
        completedReports: completedNearby,
        thisMonthReports: thisMonthNearby,
      },
      eventsInAreaData,
      monthlyTrendData,
      weeklyActivityData,
    })
  );
});


const MapReport = asyncHandler(async (req, res) => {
  const { lat, long, radius } = req.params;

  // Parse numbers safely
  const latNum = parseFloat(lat);
  const longNum = parseFloat(long);
  const queryRadiusKm = req.query.radiusKm; // optional ?radiusKm=...

  // Final radius (query overrides URL param)
  const finalRadiusKm = Math.min(
    Math.max(queryRadiusKm ? parseFloat(queryRadiusKm) : parseFloat(radius) || 2, 0.5),
    10
  );
  const radiusMeters = finalRadiusKm * 1000;

  // Geo filter
  const filter = {
    location: {
      $geoWithin: {
        $centerSphere: [[longNum, latNum], radiusMeters / 6378100], // earth radius in meters
      },
    },
  };

  const reports = await Report.find(filter)
    .populate("reported_by", "fullname")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    data: reports,
  });
});



export {
    CreateReport,
    seeurReorts,
    GetLocalAlerts,ViewReports,getUserReportDashboardStats,MapReport
}
