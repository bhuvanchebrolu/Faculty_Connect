import express from "express";
const router = express.Router();

// const { authenticate }  = require("../middlewares/auth.middleware");
// const { authorizeRole } = require("../middlewares/role.middleware");
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";

import {
  uploadResume,
  getAllProfessors,
  getProfile,
  updateProfile,
} from "../controllers/student.controller.js";

router.use(authenticate, authorizeRole("student"));

router.post("/resume", uploadResume);

router.get("/professors", getAllProfessors);


router.get("/profile",  getProfile);
router.put("/profile",  updateProfile);

export default router