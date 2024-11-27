import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import Student from "../models/students.model.js";
import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js"; 

export const changePassword = async (req, res) => {
  const { name,email,id, oldPassword, newPassword,confirmPassword} = req.body;

  // Validate request body
  if (!id || !oldPassword || !newPassword|| !confirmPassword ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirm password do not match." });
  }

  try {
    let user = await Student.findOne({ id});
    let role = "student";

    // Check in teachers if not found in students
    if (!user) {
      user = await Teacher.findOne({ id});
      role = "teacher";
    }

    // Check in admins if not found in teachers
    if (!user) {
      user = await Admin.findOne({ id});
      role = "admin";
    }

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail", // Use Gmail or other email service
        auth: {
          user: process.env.EMAIL_USER, // Email address from .env
          pass: process.env.EMAIL_PASS, // Password or App Password from .env
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email
        to: email, // Assuming the user object has an `email` field
        subject: "Password Change Successful",
        html: `
          <h1>Password Changed Successfully</h1>
          <p>Dear ${name || "User"},</p>
          <p>Your password has been successfully updated.</p>
          <p>If you did not make this change, please contact support immediately.</p>
          <p>Best regards,</p>
          <p>The Team</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
  
    return res.status(200).json({ message: `Password updated successfully for ${role}.` });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
