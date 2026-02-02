import Project from "../models/Project.Model.js";
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
    // createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

const getMyProjects = asyncHandler(async (req, res) => {
  //   const filter = { createdBy: req.user._id };
  const filter = {};
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
    // createdBy: req.user._id,
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

  const applications = await Application.find(filter)
    .populate(
      "student",
      "name email rollNumber branch year resumeUrl profileImage",
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
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

export {
  createProject,
  getMyProjects,
  getApplications,
  updateApplicationStatus,
  getAllStudents,
};

