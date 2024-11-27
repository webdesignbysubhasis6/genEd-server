import Attendance from "../models/attendance.model.js";
import Student from "../models/students.model.js";

// Controller function to get attendance by semester and month
export const getAttendanceBySemesterAndMonth = async (req, res) => {
  const { semester, month } = req.query;

  try {
    // Find all students in the specified semester
    const students = await Student.find({ semester });
    // console.log(students);
    // Prepare an array of student IDs for querying attendance
    const studentIds = students.map((student) => student.id);

    // Find attendance records for the specified month and for students in the semester
    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date:month, // Regex to match month in the format "MM/YYYY"
    });
    // console.log(attendanceRecords);
    // Create a response array to include each student's attendance or null values if absent
    const result = students.flatMap((student) => {
      // Get all attendance records for the student
      const attendanceForStudent = attendanceRecords.filter(
        (record) => record.studentId === student.id
      );
      console.log(attendanceForStudent);
      // If the student has attendance records, map each one to the desired structure
      if (attendanceForStudent.length > 0) {
        return attendanceForStudent.map((record) => ({
          id: record.id,
          studentId: record.studentId,
          name: student.name,
          semester: student.semester,
          present: record.present,
          day: record.day,
          date: record.date,
        }));
      }

      // If no attendance records, return a single entry with null attendance fields
      return {
        id: null,
        studentId: student.id,
        name: student.name,
        semester: student.semester,
        present: false,
        day: null,
        date: null,
      };
    });




    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching attendance data." });
  }
};

export const addAttendance = async (req, res) => {
  try {
    const {id,studentId, present, day, date } = req.body;
    // console.log(req.body);
    // Create a new attendance document
    const newAttendance = new Attendance({
      id,
      studentId,
      present,
      day,
      date,
    });

    // Save the document to the database
    await newAttendance.save();

    res.status(201).json({
      message: "Attendance added successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({
      message: "Failed to add attendance",
      error: error.message,
    });
  }
};


export const deleteAttendance=async(req,res)=>{
  const { studentId, day, date } = req.query;

  try {
    // Find the attendance record by studentId, day, and date
    const attendanceRecord = await Attendance.findOneAndDelete({
      studentId: parseInt(studentId),
      day: parseInt(day),
      date: date,
    });

    // Check if attendance record exists
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Send success response
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "An error occurred while deleting the attendance record" });
  }
};

export const getMonthlyAttendance = async (req, res) => {
  try {
    const { semester,month } = req.query;

    // Extract the month and year from the date string (e.g., "11/2024")
    // .[month, year] = date.split("/").map(Number);

    // Find attendance records for the specified month/year and semester
    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          date: month, // Filter attendance by month/year
          present: true,
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "id",
          as: "studentInfo",
        },
      },
      {
        $match: {
          "studentInfo.semester": semester, // Filter by semester
        },
      },
      {
        $group: {
          _id: "$day", // Group by day within the specified month
          presentCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 }, // Sort by day in descending order (latest first)
      },
      {
        $limit: 7, // Limit results to the last 7 days
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          presentCount: "$presentCount",
        },
      },
    ]);

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAttendanceByStudentAndMonth = async (req, res) => {
  try {
    const { studentId, month } = req.query;
    // Validate query parameters
    if (!studentId || !month) {
      return res.status(400).json({ error: 'studentId and date are required' });
    }
    const idPattern = new RegExp(`${studentId}-\\d+/${month}$`);
    // Fetch attendance records matching the studentId and date
    const records = await Attendance.find({id: { $regex: idPattern }});
    if (records.length === 0) {
      return res.status(200).json([]);
    }
    // if (records.length === 0) {
    //   return res.status(404).json({ message: 'No records found' });
    // }

    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

