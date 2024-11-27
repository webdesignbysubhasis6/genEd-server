import mongoose from "mongoose";

const monthClassSchema = new mongoose.Schema(
  {
    id:{
      type:String,
      required:true,
      unique:true,
    },
    occurence: {
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
const MonthClass = mongoose.model("MonthClass", monthClassSchema);
export default MonthClass;
