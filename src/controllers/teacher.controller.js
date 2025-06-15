import Teacher from "../models/teacher.model.js"; // Adjust path as per your project structure
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
// Load environment variables
dotenv.config();


export const updateTeacherProfileImage = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !req.file) {
      return res.status(400).json({ message: "Teacher ID and image file are required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "teachers/profile_images",
    });

    fs.unlinkSync(req.file.path);

    const updatedTeacher = await Teacher.findOneAndUpdate(
      { id },
      { image: result.secure_url },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating teacher profile image:", error);
    return res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};
export const addTeacher = async (req, res) => {
  try {
    console.log(req.body);

    // Extract teacher data from the request body
    const { id, name, email, department, gender, contact } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !email || !department || !gender || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the teacher with the given ID already exists
    const existingTeacher = await Teacher.findOne({ id });
    if (existingTeacher) {
      return res.status(409).json({ message: "Teacher with this ID already exists" });
    }
    const hashedPassword = await bcrypt.hash(id.toString(), 10);
    // Create a new teacher instance
    const newTeacher = new Teacher({
      id,
      name,
      email,
      department,
      gender,
      contact,
      password: hashedPassword,
    });

    // Save the new teacher to the database
    await newTeacher.save();

    // Send a welcome email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail or other email service
      auth: {
        user: process.env.EMAIL_USER, // Email address from .env
        pass: process.env.EMAIL_PASS, // Password or App Password from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to: email, // Recipient email
      subject: "Welcome to GenEd",
      html: `
        <h1>Welcome to GenEd</h1>
        <p>Dear ${name},</p>
        <p>We are excited to have you join us in the ${department} department!</p>
        <p>Below are your initial login credentials:</p>
        <ul>
          <li><strong>UserId:</strong> ${id}</li>
          <li><strong>Password:</strong> ${id}</li>
        </ul>
        <p>Please log in to your account and update your password as soon as possible.</p>
        <p>Best regards,</p>
        <p>The GenEd Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(201).json({
      message: "Teacher added successfully and email sent",
      teacher: newTeacher,
    });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
    try {
      // Fetch all teachers from the database
      const teachers = await Teacher.find(); // This fetches all teacher records
  
      // If no teachers are found
      if (!teachers || teachers.length === 0) {
        return res.status(404).json({ message: "No teachers found" });
      }
  
      // Return the list of teachers
      res.status(200).json({
        message: "Teachers fetched successfully",
        data: teachers,
      });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching teachers:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };

  export const deleteTeacherById = async (req, res) => {
    try {
      const { id } = req.query; // Get ID from query parameters
  
      // Check if the ID is provided
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
  
      // Find the teacher by ID and delete it
      const teacher = await Teacher.findOneAndDelete({ id });
  
      // If teacher is not found
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      // Send success response
      res.status(200).json({
        message: "Teacher record deleted successfully",
        teacher,
      });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };
