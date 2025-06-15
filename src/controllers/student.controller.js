import Student from "../models/students.model.js";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Load environment variables
dotenv.config();

export const updateStudentProfileImage = async (req, res) => {
  try {
    const { id } = req.body;

    // Check for file and id
    if (!id || !req.file) {
      return res.status(400).json({ message: "Student ID and image file are required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "students/profile_images",
    });

    // Remove file from server after upload
    fs.unlinkSync(req.file.path);

    // Update the student document with the image URL
    const updatedStudent = await Student.findOneAndUpdate(
      { id },
      { image: result.secure_url },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};


export const addStudent = async (req, res) => {
  try {
    console.log(req.body);
    // Extract student data from the request body
    const { id, name, semester, email, gender, contact } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !email || !semester || !gender || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the student with the given ID already exists
    const existingStudent = await Student.findOne({ id });
    if (existingStudent) {
      return res.status(409).json({ message: "Student with this ID already exists" });
    }

    // Hash the ID to use as the initial password
    const hashedPassword = await bcrypt.hash(id.toString(), 10);

    // Create a new student instance
    const newStudent = new Student({
      id,
      name,
      email,
      semester,
      gender,
      contact,
      password: hashedPassword, // Save hashed password
    });

    // Save the new student to the database
    await newStudent.save();

    // Send a welcome email with login credentials
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
      subject: "Onboarding to GenEd",
      html: `
        <h1>Welcome to GenEd</h1>
        <p>Dear ${name},</p>
        <p>We are thrilled to have you onboard! Below are your login credentials:</p>
        <ul>
          <li><strong>UserId:</strong> ${id}</li>
          <li><strong>Password:</strong> ${id}</li>
        </ul>
        <p>Please log in to your account and update your password as soon as possible.</p>
        <p>Best regards,</p>
        <p>The Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(201).json({
      message: "Student added successfully and email sent",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getAllStudents = async (req, res) => {
    try {
      // Fetch all students from the database
      const students = await Student.find(); // This fetches all student records
  
      // If no students are found
      if (!students || students.length === 0) {
        return res.status(404).json({ message: "No students found" });
      }
  
      // Return the list of students
      res.status(200).json({
        message: "Students fetched successfully",
        data: students,
      });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching students:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };

  // Controller to delete student by ID
export const deleteRecordById = async (req, res) => {
    try {
      const { id } = req.query; // Get ID from query parameters
  
      // Check if the ID is provided
      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }
  
      // Find the student by ID and delete it
      const student = await Student.findOneAndDelete({ id });
  
      // If student is not found
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Send success response
      res.status(200).json({ message: "Student record deleted successfully", student });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
