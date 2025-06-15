import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique:true,
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required:true,
    },
    email:{
      type: String,
      required:true,
      unique:true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    semester: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
