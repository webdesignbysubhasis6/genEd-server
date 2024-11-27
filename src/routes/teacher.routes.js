import express from "express";
import { addTeacher, deleteTeacherById, getAllTeachers } from "../controllers/teacher.controller.js";

const router = express.Router();

router.post("/add-teacher",addTeacher)
router.get("/get-all-teachers",getAllTeachers)
router.get("/deleteRecord",deleteTeacherById)
export default router;