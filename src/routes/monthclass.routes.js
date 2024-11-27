import express from "express";
import { addMonthlyClass,  deleteMonthlyClass,  getClassesBySemesterAndMonth } from "../controllers/monthclass.controller.js"; // Adjust path if needed

const router = express.Router();

router.post("/add-monthly-class", addMonthlyClass);
router.get("/getClasses", getClassesBySemesterAndMonth);
router.delete("/delete-monthly-class",deleteMonthlyClass)
export default router;
