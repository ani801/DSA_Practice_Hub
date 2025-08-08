
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    potdref: [{
        year: {
            type: String,
            required: true,
        },
        year_ref:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PotdMonth",
            required: true,
        }
}],
problems:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DsaProblem",      
    }
],
    institution: {
        type: String,
        default: "Not Specified",
    },
   instagrm: {
        type: String,
        default: "Not Specified",
    },  
    linkedin: {
        type: String,
        default: "Not Specified",
    },
    github: {
        type: String,
        default: "Not Specified",
    },
    facebook: {
        type: String,
        default: "Not Specified",
    },
    x: {
        type: String,
        default: "Not Specified",
    },
    otpCode: {
        type: String,
        default: undefined,
    },
    otpExpires: {
        type: Date,
        default: undefined,
    },  
    timeStamp: {
        type: Date,
        default: Date.now,
    }});
const User = mongoose.model("User", userSchema);
export default User;

