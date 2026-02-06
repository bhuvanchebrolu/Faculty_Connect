import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

import {
  createProject,
  getMyProjects,
  getApplications,
  updateApplicationStatus,
  getAllStudents,
} from "../controllers/professor.controller.js";

router.use(authenticate, authorizeRole("professor"));

router.post("/projects",  createProject);
router.get("/projects",   getMyProjects);

router.get("/projects/:projectId/applications", getApplications);

router.put("/applications/:applicationId", updateApplicationStatus);

router.get("/students", getAllStudents);

export default router;
