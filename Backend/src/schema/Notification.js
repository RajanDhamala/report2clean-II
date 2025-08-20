import mongoose from "mongoose";

const SingleNotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  isReaded: {
    type: Boolean,
    default: false
  },
  time: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['success', 'event', 'social', 'reward', 'other'],
    default: 'other'
  },
  link: {
    type: String,
    default: ''
  }
});

const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  notifications: [SingleNotificationSchema]
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
