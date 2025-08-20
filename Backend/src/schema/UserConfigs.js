import mongoose from 'mongoose'

const UserconfigSchema=mongoose.Schema({
    ownedby:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },emailNotification:{
        type:Boolean,
        default:false
    },nearbyAlerts:{
        type:Boolean,
        default :true
    },pushNotifications:{
        type:Boolean,
        default:true
    },emergencyNoti:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const UserConfig=mongoose.models.UserConfig || mongoose.model('UserConfig', UserconfigSchema);

export default UserConfig