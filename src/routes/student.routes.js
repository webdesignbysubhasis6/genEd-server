import express from "express";
import { addStudent, deleteRecordById, getAllStudents } from "../controllers/student.controller.js";

const router = express.Router();

router.post("/add-student",addStudent)
router.get("/get-all-students",getAllStudents)
router.get("/deleteRecord",deleteRecordById)
export default router;
