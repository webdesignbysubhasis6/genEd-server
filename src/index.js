import express from "express";
import { connectDb } from "./config/dbConnection.js";
import cors from "cors";
// *********** All-Routes *************
import studentRoutes from "./routes/student.routes.js";
import attendanceRoutes from './routes/attendance.routes.js'
import auth from './routes/auth.routes.js'
import teacherRoutes from "./routes/teacher.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import monthclassRoutes from "./routes/monthclass.routes.js"
import utilsRoutes from "./routes/utils.routes.js"
import dotenv from "dotenv"
// *********** All-Routes *************
dotenv.config();
const app = express();
// Use cors middleware
app.use(cors());

app.use(
  cors({
    origin: "*", // Replace with the frontend's URL (React app)
    methods: "GET,POST,PUT,DELETE,PATCH", // Allowed methods
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *********** All-Routes *************

app.get("/", (req, res) => {
  res.json("I'm coming from backend");
});
app.use("/api/auth/v1",auth);
app.use("/api/student/v1", studentRoutes);
app.use("/api/attendance/v1",attendanceRoutes);
app.use("/api/teacher/v1",teacherRoutes)
app.use("/api/admin/v1",adminRoutes)
app.use("/api/monthclass/v1",monthclassRoutes)
app.use("/api/utils/v1",utilsRoutes)

// For wrong APIs
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check the URL and try again.",
  });
});

// Error handling middleware (fix)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: err.message,
  });
});

app.listen(process.env.PORT, async () => {
  console.log("Server is running");
  await connectDb();
});
