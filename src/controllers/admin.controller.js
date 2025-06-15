import Admin from "../models/admin.model.js"; // Adjust the path to your admin model
import bcrypt from 'bcrypt'
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const updateAdminProfileImage = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !req.file) {
      return res.status(400).json({ message: "Admin ID and image file are required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "admins/profile_images",
    });

    fs.unlinkSync(req.file.path);

    const updatedAdmin = await Admin.findOneAndUpdate(
      { id },
      { image: result.secure_url },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating admin profile image:", error);
    return res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
    });
  }
};

export const addAdmin = async (req, res) => {
  try {
    // console.log(req.body);

    // Extract admin data from the request body
    const { id, name, email, gender, contact } = req.body;

    // Check if all required fields are provided
    if (!id || !name || !email || !gender || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the admin with the given ID already exists
    const existingAdmin = await Admin.findOne({ id });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this ID already exists" });
    }

    // Check if the admin with the given email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(id.toString(), 10);
    // Create a new admin instance
    const newAdmin = new Admin({
      id,
      name,
      email,
      gender,
      contact,
      password:hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Send a success response
    res.status(201).json({
      message: "Admin added successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
