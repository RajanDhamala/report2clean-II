import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  refreshToken: {
    type: String,
    default: null
  },
  phone_no: {
    type: Number,
    required: [true, "Phone number is required"],
    unique: true
  },
  province: {
    type: String,
    enum: [
      "Koshi", "Madhesh", "Bagmati",
      "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"
    ],
  },
  district: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  }
}, {
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
