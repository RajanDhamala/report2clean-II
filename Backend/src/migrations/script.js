import ConnectDb from '../databse/Connect.js';
import mongoose from "mongoose";

const fixTypoInReports = async () => {
  try {
    await ConnectDb();
    const db = mongoose.connection.db;
    const reports = db.collection("reports");

    const copyRes = await reports.updateMany(
      { accetedBy: { $exists: true } },
      [{ $set: { acceptedBy: "$accetedBy" } }]
    );

    const removeRes = await reports.updateMany(
      { accetedBy: { $exists: true } },
      { $unset: { accetedBy: "" } }
    );

    console.log(`Renamed accetedBy → acceptedBy in ${copyRes.modifiedCount} docs.`);
    console.log(`Removed accetedBy field in ${removeRes.modifiedCount} docs.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
  }
};

fixTypoInReports();
