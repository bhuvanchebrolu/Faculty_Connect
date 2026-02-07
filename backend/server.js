import "./config/env.js";
import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

// // routes
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import professorRoutes from "./routes/professor.routes.js";
import projectRoutes from "./routes/project.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// error middleware
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

import path from "path";

// dotenv.config({
//   path: path.resolve(process.cwd(), ".env"),
// });

console.log("MONGO_URI:", process.env.MONGO_URI);


// DB connection
connectDB();

const app = express();

/* =====================
   Middlewares
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* =====================
   Routes
===================== */
app.get("/", (req, res) => {
  res.send("Faculty Connect API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

/* =====================
   Error Handling
===================== */
app.use(notFound);
app.use(errorHandler);

/* =====================
   Server
===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('=== Environment Variables Check ===');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET (length: ' + process.env.SENDGRID_API_KEY.length + ')' : 'NOT SET');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
console.log('===================================');
  console.log(` Server running on port ${PORT}`);
});
