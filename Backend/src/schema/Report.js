import mongoose from "mongoose";
const ReportSchema=mongoose.Schema({
    reported_by:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    coordinates:{
        latitude:{
            type:Number,
            required:true,
            min:-90,
            max:90
        },
        longitude:{
            type:Number,
            required:true,
            min:-180,
            max:180
        }
    },
    media:[
        {
            type:String,
            enum:['img','video']
        }
    ]
}, {
    timestamps: true
})
const Report= mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default Report