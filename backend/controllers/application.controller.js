
import Application from "../models/Application.model.js";
import Project from "../models/Project.Model.js";
import User from "../models/User.model,js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// const sendEmail    = require("../utils/sendEmail");

//create application
const createApplication = asyncHandler(async (req, res) => {
  const {
    projectId,
    applicantName,
    applicantEmail,
    applicantPhone,
    rollNumber,
    year,
    branch,
    cgpa,
    statementOfInterest,
    skills,
    priorExperience,
    resumeUrl,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
  } = req.body;

  // --- validate required fields -----------------------------------------------
  const requiredFields = {
    projectId,
    applicantName,
    applicantEmail,
    applicantPhone,
    rollNumber,
    year,
    branch,
    cgpa,
    statementOfInterest,
    resumeUrl,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (field) => !requiredFields[field] && requiredFields[field] !== 0
  );

  if (missingFields.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  // --- validate email format --------------------------------------------------
  const emailRegex = /^[a-zA-Z0-9._-]+@nitt\.edu\.in$/;
  if (!emailRegex.test(applicantEmail)) {
    throw new ApiError(400, "Email must be a valid @nitt.edu.in address");
  }

  // --- validate year ----------------------------------------------------------
  if (year < 1 || year > 4) {
    throw new ApiError(400, "Year must be between 1 and 4");
  }

  // --- validate CGPA ----------------------------------------------------------
  if (cgpa < 0 || cgpa > 10) {
    throw new ApiError(400, "CGPA must be between 0 and 10");
  }

  // --- verify the project exists ----------------------------------------------
  // We need to fetch it anyway to populate the professor's email for the
  // notification, so we do the existence check at the same time.
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "name email"
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const application = await Application.create({
    // student: req.user._id, 
    project: projectId,
    applicantName,
    applicantEmail,
    applicantPhone,
    rollNumber,
    year,
    branch,
    cgpa,
    statementOfInterest,
    skills: skills || "",
    priorExperience: priorExperience || "",
    resumeUrl,
    portfolioUrl: portfolioUrl || null,
    githubUrl: githubUrl || null,
    linkedinUrl: linkedinUrl || null,
  });
//   if (!application.emailSentToProfessor) {
//     const subject = `📩 New Application – ${project.title}`;
    
//     // Construct detailed email body with all application info
//     const body = `Hi ${project.createdBy.name},

// A new student has applied to your project "${project.title}".

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPLICANT DETAILS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Name:         ${applicantName}
// Email:        ${applicantEmail}
// Phone:        ${applicantPhone}
// Roll Number:  ${rollNumber}
// Year:         ${year}
// Branch:       ${branch}
// CGPA:         ${cgpa}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATEMENT OF INTEREST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ${statementOfInterest}

// ${skills ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKILLS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ${skills}
// ` : ''}
// ${priorExperience ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRIOR EXPERIENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ${priorExperience}
// ` : ''}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Resume:    ${resumeUrl}
// ${portfolioUrl ? `Portfolio: ${portfolioUrl}` : ''}
// ${githubUrl ? `GitHub:    ${githubUrl}` : ''}
// ${linkedinUrl ? `LinkedIn:  ${linkedinUrl}` : ''}

// Please log in to Faculty Connect to review and respond to this application.

// Best regards,
// Faculty Connect Team`;

//     // Fire-and-forget — we don't await so a mail-server hiccup doesn't break
//     // the apply flow. The student gets their success response either way.
//     sendEmail({
//       to: project.createdBy.email,
//       subject,
//       body,
//     });

//     // Mark the flag so we never send this email again for this application
//     await Application.findByIdAndUpdate(application._id, {
//       emailSentToProfessor: true,
//     });
//   }

  const populatedApplication = await Application.findById(application._id)
    .populate({
      path: "project",
      select: "title domain deadline status createdBy",
      populate: {
        path: "createdBy",
        select: "name email department designation",
      },
    })
    .populate("student", "name email");

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: populatedApplication,
  });
});


//my applications
const getMyApplications = asyncHandler(async (req, res) => {
  const filter = { student: req.user._id }; 
  // optional status filter from query string, e.g. ?status=pending
  if (req.query.status) {
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(req.query.status)) {
      throw new ApiError(
        400,
        "status must be one of: pending, approved, rejected"
      );
    }
    filter.status = req.query.status;
  }

  // --- query ------------------------------------------------------------------
  const applications = await Application.find(filter)
    .populate({
      path: "project",
      select: "title domain deadline status createdBy",
      populate: {
        path: "createdBy",
        select: "name email department designation",
      },
    })
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

//get the application by ID
const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findOne({
    _id: id,
    student: req.user._id,
  }).populate({
    path: "project",
    select: "title domain deadline status createdBy maxStudents enrolledCount",
    populate: {
      path: "createdBy",
      select: "name email department designation",
    },
  });

  if (!application) {
    throw new ApiError(
      404,
      "Application not found or you don't have permission to view it"
    );
  }

  res.status(200).json({
    success: true,
    data: application,
  });
});

export {
    createApplication,
    getMyApplications,
    getApplicationById
}