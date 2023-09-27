import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        trim: true,
        default: "Văn Nam Phúc"
    },
    dob: {
        type: String,
        required: true,
        min: 3,
        trim: true,
        default: "07/12/2003"
    },
    sex: {
        type: String,
        required: true,
        min: 3,
        trim: true,  
        default: "Nam"      
    },
    myClass: {
        type: String,
        required: true,
        min: 3,
        trim: true,
        default: "MD18101"
    },
    identity: {
        type: String,
        required: true,
        min: 3,
        trim: true,
        default: "PS25452"
    },
});

export default mongoose.model("User", userSchema);