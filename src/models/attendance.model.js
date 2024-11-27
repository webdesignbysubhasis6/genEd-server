import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    id:{
      type:String,
      required:true,
      unique:true,
    },
    studentId: {
        type: Number,
        required: true,
      },
    present: {
      type: Boolean,
      required:true,
      default:false,
    },
    day: {
      type: Number,
      required: true,
      default:null
    },
    date: {
      type: String,
      required: true,
      default:null
    },
  }
);
const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
