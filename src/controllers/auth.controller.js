import jwt from "jsonwebtoken";
import Student from "../models/students.model.js";
import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt"
export const Login = async (req, res) => {
  const { id,password } = req.body; // Assuming `id` is the unique identifier for all roles
  try {
    let user = await Student.findOne({ id});
    let role = "student";

    // If not found in students, check teachers
    if (!user) {
      user = await Teacher.findOne({ id});
      role = "teacher";
    }

    // If not found in teachers, check admins
    if (!user) {
      user = await Admin.findOne({id});
      role = "admin";
    }

    // If user is still not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter a valid password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: user,
      role,
      token,
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
