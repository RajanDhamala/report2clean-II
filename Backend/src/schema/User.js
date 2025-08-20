import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  phone_no: {
    type: Number,
    required: [true, "Phone number is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{7,15}$/.test(v.toString()); 
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
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
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default:'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => arr.length === 2,
        message: 'Coordinates must be [longitude, latitude]',
      },
      default:[0,0]
    },
  },
  profilePic: {
    type: String,
    default: "",
  },
  gov_id: {
    type: String,
    default: "", 
  },
  isAuthencated: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },type:{
    type:String,
    enum:['admin','user'],
    default:'user'
  }
}, {
  timestamps: true,
});

UserSchema.index({ location: '2dsphere' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
