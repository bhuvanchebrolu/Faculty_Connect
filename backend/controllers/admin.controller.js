import Application from "../models/Application.model.js";
import Project from "../models/Project.model.js";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sendApplicationStatusEmail } from "../utils/sendEmail.js"


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

const getPendingApplications = asyncHandler(async (req, res) => {
  const pendingApplications = await Application.find(
    { status: "pending" },
    "applicantName rollNumber branch year cgpa project status resumeUrl createdAt"
  )
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: pendingApplications.length,
    data: pendingApplications,
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

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, feedback } = req.body;

  if (!status || !["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "status must be 'approved' or 'rejected'");
  }

  const application = await Application.findById(applicationId)
    .populate("project", "createdBy title")
    .populate("student", "name email");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "You are not admin to accept or reject",
    );
  }

  if (application.status !== "pending") {
    throw new ApiError(
      400,
      `Application is already "${application.status}" — only pending applications can be approved or rejected`,
    );
  }

  application.status = status;
  if (feedback) {
    application.feedback = feedback;
  }
  await application.save();
  
  sendApplicationStatusEmail(application.applicantEmail, application.applicantName, application.project.title , status, feedback);
  

  //  if (!application.emailSentToStudent) {
  //     const subject =
  //       status === "approved"
  //         ? ` Application Approved – ${application.project.title}`
  //         : `Application Rejected – ${application.project.title}`;

  //     const body =
  //       status === "approved"
  //         ? `Hi ${application.student.name},\n\nYour application for the project "${application.project.title}" has been approved. Please reach out to your professor for next steps.\n\nBest regards,\nFaculty Connect`
  //         : `Hi ${application.student.name},\n\nYour application for the project "${application.project.title}" has been rejected.${
  //             feedback ? `\n\nFeedback: ${feedback}` : ""
  //           }\n\nBest regards,\nFaculty Connect`;

  //     // sendEmail is fire-and-forget here — we don't await it so a mail-server
  //     // hiccup doesn't break the approve/reject response. It runs in the background.
  //     sendEmail({
  //       to: application.student.email,
  //       subject,
  //       body,
  //     });

  //     // mark the flag so we never send this email again for this status
  //     await Application.findByIdAndUpdate(applicationId, {
  //       emailSentToStudent: true,
  //     });
  //   }

  res.status(200).json({
    success: true,
    message: `Application ${status === "approved" ? "approved" : "rejected"} successfully`,
    data: application,
  });
});

const createProjectByAdmin = async (req, res) => {
  try {
    const {
      professorEmail,
      title,
      description,
      domain,
      skillsRequired,
      maxStudents,
      deadline,
      attachmentUrl,
      cvRequired
    } = req.body;

    // Validate required fields
    if (!professorEmail || !title || !description || !domain || !skillsRequired || !maxStudents || !deadline) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if professor exists with this email
    const professor = await User.findOne({
      email: professorEmail,
      role: "professor"
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: `No professor found with email: ${professorEmail}`
      });
    }

    // Create project
    const project = new Project({
      title,
      description,
      domain,
      skillsRequired,
      maxStudents,
      deadline,
      attachmentUrl,
      cvRequired: cvRequired !== undefined ? cvRequired : true,
      createdBy: professor._id,
      status: "open"
    });

    await project.save();

    // Populate createdBy field
    await project.populate('createdBy', 'name email department');

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message
    });
  }
};


 const deleteProjectByAdmin = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Delete all applications for this project
    const deletedApps = await Application.deleteMany({ projectId: projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: `Project deleted successfully. ${deletedApps.deletedCount} applications also removed.`,
      data: {
        projectId,
        deletedApplications: deletedApps.deletedCount
      }
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
};
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
  getPendingApplications,
  updateApplicationStatus,
  createProjectByAdmin,
  deleteProjectByAdmin
};