import express from "express";
import { changePassword } from "../controllers/utils.controller.js";

const router = express.Router();

router.post("/change-password",changePassword)
export default router;