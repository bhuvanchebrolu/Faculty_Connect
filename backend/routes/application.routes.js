import express from "express";
const router = express.Router();

import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

import {
  createApplication,
  getMyApplications,
  getApplicationById,
} from "../controllers/application.controller.js";

// Student routes
router.post(
  "/",
  authenticate,
  authorizeRole("student"),
  createApplication
);

router.get(
  "/",
  authenticate,
  authorizeRole("professor"),
  getMyApplications
);

// Professor route
router.get(
  "/:id",
  authenticate,
  authorizeRole("professor"),
  getApplicationById
);

export default router;
