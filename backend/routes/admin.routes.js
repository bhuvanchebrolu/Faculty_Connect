import express from "express"
const router=express.Router();
// const { authenticate }  = require("../middlewares/auth.middleware");
// const { authorizeRole } = require("../middlewares/role.middleware");


import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createProject,
  getAllProjects,
  deleteProject,
  getAnalytics,
} from "../controllers/admin.controller.js";

// router.use(authenticate, authorizeRole("admin"));


router.post("/users", createUser);

// GET    /api/admin/users 
router.get("/users", getAllUsers);

// GET    /api/admin/users/:id           
router.get("/users/:id", getUserById);

// PUT    /api/admin/users/:id        

router.put("/users/:id", updateUser);

// DELETE /api/admin/users/:id            

router.delete("/users/:id", deleteUser);


// ═════════════════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

// POST   /api/admin/projects           
router.post("/projects", createProject);

// GET    /api/admin/projects          
router.get("/projects", getAllProjects);

// DELETE /api/admin/projects/:id        
router.delete("/projects/:id", deleteProject);


// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═════════════════════════════════════════════════════════════════════════════

// GET    /api/admin/analytics            
router.get("/analytics", getAnalytics);

export default router;
