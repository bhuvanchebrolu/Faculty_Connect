import Application from "../models/Application.model.js";
import Project from "../models/Project.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";



const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    rollNumber,
    year,
    branch,
    department,
    designation,
    profileImage,
  } = req.body;

  // --- validate required fields -------------------------------------------
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "name, email, password, and role are required");
  }

  // --- validate role ------------------------------------------------------
  const allowedRoles = ["student", "professor", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "role must be one of: student, professor, admin");
  }

  // --- check if email already exists --------------------------------------
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // --- create user --------------------------------------------------------
  const userData = {
    name,
    email,
    password, // will be hashed by pre-save hook
    role,
    profileImage: profileImage || "",
  };

  // Add role-specific fields
  if (role === "student") {
    if (rollNumber) userData.rollNumber = rollNumber;
    if (year) userData.year = year;
    if (branch) userData.branch = branch;
  } else if (role === "professor") {
    if (department) userData.department = department;
    if (designation) userData.designation = designation;
  }

  const user = await User.create(userData);

  // Return user without password
  const userResponse = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
    data: userResponse,
  });
});


const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};

  // --- role filter --------------------------------------------------------
  if (req.query.role) {
    const allowedRoles = ["student", "professor", "admin"];
    if (!allowedRoles.includes(req.query.role)) {
      throw new ApiError(400, "role must be one of: student, professor, admin");
    }
    filter.role = req.query.role;
  }

  // --- search filter ------------------------------------------------------
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [
      { name: regex },
      { email: regex },
      { rollNumber: regex },
      { department: regex },
    ];
  }

  // --- query --------------------------------------------------------------
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});



const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});


const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // --- guard: prevent empty updates ---------------------------------------
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  // --- if password is being updated, use save() to trigger the hash hook --
  if (updates.password) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Apply all updates
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save(); // triggers pre-save hook to hash password

    const updatedUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }

  // --- if password is NOT being updated, use findByIdAndUpdate ------------
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});



const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // --- cascade deletions --------------------------------------------------
  if (user.role === "student") {
    // Delete all applications submitted by this student
    await Application.deleteMany({ student: id });
  } else if (user.role === "professor") {
    // Delete all projects created by this professor
    const professorProjects = await Project.find({ createdBy: id });
    const projectIds = professorProjects.map((p) => p._id);

    // Delete all applications to those projects
    await Application.deleteMany({ project: { $in: projectIds } });

    // Delete the projects themselves
    await Project.deleteMany({ createdBy: id });
  }

  // --- delete the user ----------------------------------------------------
  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} deleted successfully`,
  });
});


// ═════════════════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════


const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    domain,
    maxStudents,
    deadline,
    createdBy,
    skillsRequired,
    attachmentUrl,
  } = req.body;

  // --- validate required fields -------------------------------------------
  if (!title || !description || !domain || !deadline || !createdBy) {
    throw new ApiError(
      400,
      "title, description, domain, deadline, and createdBy are required"
    );
  }

  // --- verify createdBy is a professor ------------------------------------
  const professor = await User.findById(createdBy);
  if (!professor) {
    throw new ApiError(404, "Professor not found");
  }
  if (professor.role !== "professor") {
    throw new ApiError(400, "createdBy must reference a professor");
  }

  // --- create project -----------------------------------------------------
  const project = await Project.create({
    title,
    description,
    domain,
    maxStudents: maxStudents || 1,
    deadline,
    createdBy,
    skillsRequired: skillsRequired || [],
    attachmentUrl: attachmentUrl || null,
  });

  // Populate for response
  const populatedProject = await Project.findById(project._id).populate(
    "createdBy",
    "name email department designation"
  );

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: populatedProject,
  });
});


const getAllProjects = asyncHandler(async (req, res) => {
  const filter = {};

  // --- status filter ------------------------------------------------------
  if (req.query.status) {
    const allowedStatuses = ["open", "closed", "completed"];
    if (!allowedStatuses.includes(req.query.status)) {
      throw new ApiError(
        400,
        "status must be one of: open, closed, completed"
      );
    }
    filter.status = req.query.status;
  }

  // --- domain filter ------------------------------------------------------
  if (req.query.domain) {
    filter.domain = req.query.domain.trim();
  }

  // --- search filter ------------------------------------------------------
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  // --- query --------------------------------------------------------------
  const projects = await Project.find(filter)
    .populate("createdBy", "name email department designation")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});


const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // --- cascade: delete all applications to this project ------------------
  await Application.deleteMany({ project: id });

  // --- delete the project -------------------------------------------------
  await Project.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Project and associated applications deleted successfully",
  });
});


// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═════════════════════════════════════════════════════════════════════════════

const getAnalytics = asyncHandler(async (req, res) => {
  // --- user counts --------------------------------------------------------
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalProfessors = await User.countDocuments({ role: "professor" });
  const totalAdmins = await User.countDocuments({ role: "admin" });

  // --- project counts by status -------------------------------------------
  const openProjects = await Project.countDocuments({ status: "open" });
  const closedProjects = await Project.countDocuments({ status: "closed" });
  const completedProjects = await Project.countDocuments({
    status: "completed",
  });
  const totalProjects = await Project.countDocuments();

  // --- application counts by status ---------------------------------------
  const pendingApplications = await Application.countDocuments({
    status: "pending",
  });
  const approvedApplications = await Application.countDocuments({
    status: "approved",
  });
  const rejectedApplications = await Application.countDocuments({
    status: "rejected",
  });
  const totalApplications = await Application.countDocuments();

  // --- projects by domain (top 5) -----------------------------------------
  const projectsByDomain = await Project.aggregate([
    { $group: { _id: "$domain", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { domain: "$_id", count: 1, _id: 0 } },
  ]);

  // --- recent activity (last 10 applications) -----------------------------
  const recentApplications = await Application.find()
    .populate("student", "name email rollNumber")
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .limit(10);

  // --- top active professors (by project count) ---------------------------
  const topProfessors = await Project.aggregate([
    { $group: { _id: "$createdBy", projectCount: { $sum: 1 } } },
    { $sort: { projectCount: -1 } },
    { $limit: 5 },
  ]);

  // Populate professor details
  const topProfessorsWithDetails = await User.populate(topProfessors, {
    path: "_id",
    select: "name email department designation",
  });

  // --- response -----------------------------------------------------------
  res.status(200).json({
    success: true,
    data: {
      users: {
        totalStudents,
        totalProfessors,
        totalAdmins,
        total: totalStudents + totalProfessors + totalAdmins,
      },
      projects: {
        open: openProjects,
        closed: closedProjects,
        completed: completedProjects,
        total: totalProjects,
      },
      applications: {
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
        total: totalApplications,
      },
      projectsByDomain,
      recentApplications,
      topProfessors: topProfessorsWithDetails.map((item) => ({
        professor: item._id,
        projectCount: item.projectCount,
      })),
    },
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export {
  // User management
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  // Project management
  createProject,
  getAllProjects,
  deleteProject,

  // Analytics
  getAnalytics,
};