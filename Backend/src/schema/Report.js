import mongoose from "mongoose";

const ReportSchema = mongoose.Schema({
  reported_by: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [{
    type: String
  }],status:{
    type:String,
    enum:['pending','completed','rejected','onProgress'],
    default:'pending'
  },urgency:{
    type:Boolean,
    default:false
  },acceptedBy: {
  type: mongoose.Types.ObjectId,
  ref: 'User'
}
},{
  timestamps: true
});

ReportSchema.index({ location: "2dsphere" });

const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export default Report;
