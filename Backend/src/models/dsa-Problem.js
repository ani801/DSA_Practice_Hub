
import mongoose from "mongoose";
const dsaProblem = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        },
        url: {
        type: String,
        required: true,
        } ,
        difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
        },
        tags: {
        type: [String],
        required: true,
        },
        count:{
        type: Number,
        default: 0,
        },
        lastAttempted: {
        type: String,
        default: null,
        },

       note:
       {
        type: String,
        default: "",
       },
        timeStamp: {
        type: Date,
        default: Date.now,
        },
    }
)
const DsaProblem = mongoose.model("DsaProblem", dsaProblem);
export default DsaProblem;