import MonthClass from "../models/monthclass.model.js"; // Adjust the path if needed

export const addMonthlyClass = async (req, res) => {
  try {
    // Extract data from the request body
    const { id, occurrence, day, date } = req.body;

    // Validate the required fields
    if (!id || typeof occurrence === "undefined" || !day || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new MonthClass entry
    const newClass = new MonthClass({
      id,
      occurence: occurrence,
      day,
      date,
    });

    // Save to the database
    const savedClass = await newClass.save();

    // Respond with the created object
    return res.status(201).json({
      message: "Monthly class added successfully.",
      data: savedClass,
    });
  } catch (error) {
    // Handle unique constraint or database errors
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "A class with this ID already exists." });
    }

    return res.status(500).json({
      error: "An error occurred while adding the monthly class.",
      details: error.message,
    });
  }
};
export const deleteMonthlyClass = async (req, res) => {
    try {
        const { id } = req.query; 
        // Find and delete the record
        const deletedClass = await MonthClass.findOneAndDelete({ id });

        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Send success response
        res.status(200).json({ message: "Class deleted successfully", deletedClass });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).json({ message: "Server error. Failed to delete the class." });
    }
  };

export const getClassesBySemesterAndMonth = async (req, res) => {
  try {
    const { semester, month } = req.query; // Extract query parameters

    // Validate query parameters
    if (!semester || !month) {
      return res
        .status(400)
        .json({ error: "Both 'semester' and 'month' query parameters are required." });
    }

    // Construct a regex to match the `id` pattern
    const idPattern = new RegExp(`^${semester}-\\d+/${month}$`);

    // Fetch records that match the pattern
    const classes = await MonthClass.find({ id: { $regex: idPattern } });

    // Respond with the matching records
    return res.status(200).json({
      data: classes,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      error: "An error occurred while fetching the classes.",
      details: error.message,
    });
  }
};
