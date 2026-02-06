import express, { Router } from "express"

const router=express.Router();

// const { authenticate } = require("../middlewares/auth.middleware");//check in ES6
import { authenticate } from "../middlewares/auth.middleware.js";

import { getAllProjects,getProjectById } from "../controllers/project.controller.js";

router.use(authenticate);

router.get("/",getAllProjects);
router.get("/:id",getProjectById);

export default Router;