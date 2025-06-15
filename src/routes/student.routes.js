import express from "express";
import { addStudent, deleteRecordById, getAllStudents,updateStudentProfileImage } from "../controllers/student.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/add-student",addStudent)
router.get("/get-all-students",getAllStudents)
router.get("/deleteRecord",deleteRecordById)
router.post("/update-profile-image", upload.single("image"), updateStudentProfileImage);
export default router;
