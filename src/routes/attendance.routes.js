import express from "express";
import { getAttendanceBySemesterAndMonth,addAttendance ,deleteAttendance, getMonthlyAttendance, getAttendanceByStudentAndMonth} from "../controllers/attendance.controller.js";
const router = express.Router();


router.get("/get-attendance",getAttendanceBySemesterAndMonth)
router.post("/add-attendance",addAttendance)
router.delete("/delete-attendance",deleteAttendance)
router.get("/get-monthly-attendance",getMonthlyAttendance)
router.get("/get-attendance-by-StudentAndMonth",getAttendanceByStudentAndMonth)
export default router;
