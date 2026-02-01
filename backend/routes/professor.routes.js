import express from "express";
const router = express.Router();

import {
  createProject,
  getMyProjects,
  getApplications,
  updateApplicationStatus,
  getAllStudents,
} from "../controllers/professor.controller.js";

router.post("/projects",  createProject);
router.get("/projects",   getMyProjects);

router.get("/projects/:projectId/applications", getApplications);

router.put("/applications/:applicationId", updateApplicationStatus);

router.get("/students", getAllStudents);

export default router;
