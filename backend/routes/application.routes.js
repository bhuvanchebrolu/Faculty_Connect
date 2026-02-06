import express from "express"
const router=express.Router();

// const { authenticate }  = require("../middlewares/auth.middleware");
// const { authorizeRole } = require("../middlewares/role.middleware");
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/auth.middleware.js";


import {
    createApplication,
    getMyApplications,
    getApplicationById
} from "../controllers/application.controller.js";

router.use(authenticate, authorizeRole("student"));

router.post("/", createApplication);
router.get("/",  getMyApplications);
router.get("/:id", getApplicationById);

export default router;