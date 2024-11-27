import Admin from "../models/admin.model.js"; // Adjust the path to your admin model
import bcrypt from 'bcrypt'
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
