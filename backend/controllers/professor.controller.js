import Project from "../models/Project.model.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

//create project
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    domain,
    maxStudents,
    deadline,
    skillsRequired,
    attachmentUrl,
  } = req.body;
  if (!title || !description || !domain || !deadline) {
    throw new ApiError(
      400,
      "title, description, domain, and deadline are all required",
    );
  }
  const project = await Project.create({
    title,
    description,
    domain,
    maxStudents: maxStudents || 1,
    deadline,
    skillsRequired: skillsRequired || [],
    attachmentUrl: attachmentUrl || null,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

const getMyProjects = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };

  // optional status filter from query string, e.g. ?status=open
  if (req.query.status) {
    const allowed = ["open", "closed", "completed"];
    if (!allowed.includes(req.query.status)) {
      throw new ApiError(400, "status must be one of: open, closed, completed");
    }
    filter.status = req.query.status;
  }
  const projects = await Project.find(filter)
    .populate("createdBy", "name email designation department")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found or you do not own this project");
  }

  const filter = { project: projectId };

  if (req.query.status) {
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(req.query.status)) {
      throw new ApiError(
        400,
        "status must be one of: pending, approved, rejected",
      );
    }
    filter.status = req.query.status;
  }

  const applications = await Application.find(filter).populate(
    "student",
    "name email rollNumber branch year phone",
  );

  const formattedApplications = applications.map((app) => ({
    _id: app._id,
    applicantName: app.student.name,
    applicantEmail: app.student.email,
    applicantPhone: app.student.phone,
    rollNumber: app.student.rollNumber,
    branch: app.student.branch,
    year: app.student.year,
    skills: app.skills,
    cgpa: app.cgpa,
    resumeUrl: app.resumeUrl,
    statementOfInterest: app.statementOfInterest,
    status: app.status,
  }));

  res.json({
    success: true,
    data: {
      data: formattedApplications,
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

  if (application.project.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You do not own the project this application belongs to",
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

const getAllStudents = asyncHandler(async (req, res) => {
  const filter = { role: "student" };
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: regex }, { rollNumber: regex }];
  }
  const students = await User.find(filter)
    .select("-password")
    .sort({ name: 1 });

  console.log("DEBUG filter:", filter);
  console.log("DEBUG count:", students.length);
  console.log("DEBUG students:", students);

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// GET professor profile
const getProfessorProfile = asyncHandler(async (req, res) => {
  const professor = await User.findById(req.user._id).select("-password");

  if (!professor) {
    throw new ApiError(404, "Professor not found");
  }

  res.status(200).json({
    success: true,
    data: professor,
  });
});

// UPDATE professor profile
const updateProfessorProfile = asyncHandler(async (req, res) => {
  const { name, department, designation, profileImage } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (department !== undefined) updates.department = department;
  if (designation !== undefined) updates.designation = designation;
  if (profileImage !== undefined) updates.profileImage = profileImage;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const professor = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!professor) {
    throw new ApiError(404, "Professor not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: professor,
  });
});
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const professorId = req.user.id;
    
    const {
      title,
      description,
      domain,
      skillsRequired,
      maxStudents,
      deadline,
      attachmentUrl,
      cvRequired
    } = req.body;

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      createdBy: professorId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it"
      });
    }

    // Update project fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (domain) project.domain = domain;
    if (skillsRequired) project.skillsRequired = skillsRequired;
    if (maxStudents !== undefined) project.maxStudents = maxStudents;
    if (deadline) project.deadline = deadline;
    if (attachmentUrl !== undefined) project.attachmentUrl = attachmentUrl;
    if (cvRequired !== undefined) project.cvRequired = cvRequired;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const professorId = req.user.id;

    // Find project and verify ownership
    const project = await Project.findOne({
      _id: projectId,
      createdBy: professorId
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to delete it"
      });
    }

    // Delete all applications for this project first
    await Application.deleteMany({ projectId: projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project and all associated applications deleted successfully"
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
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  // --- validate status -----------------------------------------------
  const allowedStatuses = ["open", "closed", "completed"];
  if (!status || !allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "status must be one of: open, closed, completed"
    );
  }

  // --- find project + ownership check --------------------------------
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found or you do not own this project"
    );
  }

  // --- prevent invalid transitions -----------------------------------
  if (project.status === "completed") {
    throw new ApiError(
      400,
      "Completed projects cannot be reopened or modified"
    );
  }


  // --- no-op check ----------------------------------------------------
  if (project.status === status) {
    throw new ApiError(400, `Project is already "${status}"`);
  }

  // --- update ---------------------------------------------------------
  project.status = status;
  await project.save();

  res.status(200).json({
    success: true,
    message: `Project status updated to "${status}" successfully`,
    data: project,
  });
});

export {
  createProject,
  getMyProjects,
  getApplications,
  updateApplicationStatus,
  getAllStudents,
  getProfessorProfile,
  updateProfessorProfile,
  updateProject,
  deleteProject,
  updateProjectStatus,
};
