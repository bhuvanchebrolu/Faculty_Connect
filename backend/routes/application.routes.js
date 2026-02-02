import express from "express"
const router=express.Router();

// const { authenticate }  = require("../middlewares/auth.middleware");
// const { authorizeRole } = require("../middlewares/role.middleware");

import {
    createApplication,
    getMyApplications
} from "../controllers/application.controller.js";

// router.use(authenticate, authorizeRole("student"));

router.post("/",createApplication);
router.get("/",getMyApplications);

export default router;