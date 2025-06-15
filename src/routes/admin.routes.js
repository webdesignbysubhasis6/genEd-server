import express from "express";
import { addAdmin,updateAdminProfileImage} from "../controllers/admin.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post("/update-profile-image", upload.single("image"), updateAdminProfileImage);
router.post("/add-admin",addAdmin)
export default router;