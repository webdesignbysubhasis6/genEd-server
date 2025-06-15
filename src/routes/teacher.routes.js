import express from "express";
import { addTeacher, deleteTeacherById, getAllTeachers,updateTeacherProfileImage} from "../controllers/teacher.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/add-teacher",addTeacher)
router.get("/get-all-teachers",getAllTeachers)
router.get("/deleteRecord",deleteTeacherById)
router.post("/update-profile-image", upload.single("image"), updateTeacherProfileImage);
export default router;