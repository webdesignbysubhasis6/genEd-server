import express from "express";
import { addAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/add-admin",addAdmin)
export default router;