import mongoose from "mongoose";

const teacherSchema= new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique:true,
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
    department: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    contact: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return /^\d{10}$/.test(v); // Example: Validates a 10-digit phone number
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
