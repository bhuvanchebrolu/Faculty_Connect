import Application from "../models/Application.model.js";
import Project from "../models/Project.Model.js";
import User from "../models/User.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
// import sendEmail from "../utils/sendEmail.js";

//create Application

const createApplication = asyncHandler(async (req, res) => {
  const { projectId, message } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project Id is required");
  }
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "name email",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // The pre-save hook in Application.model.js will validate that the project
  // is still open and has slots available. We don't duplicate that check here.

  const application = await Application.create({
    // student:req.user._id,
    project: projectId,
    message: message || "",
  });

//   if (!application.emailSentToProfessor) {
//     const subject = `New Application – ${project.title}`;
//     const body = `Hi ${project.createdBy.name},\n\nA new student has applied to your project "${project.title}".\n\nStudent: ${req.user.name} (${req.user.email})\nMessage: ${message || "No message provided"}\n\nPlease log in to review the application.\n\nBest regards,\nFaculty Connect`;

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

    const populatedApplication=await Application.findById(application._id)
        .populate("project","title domain deadline status")
        .populate("student","name email rollNumber");

    res.status(201).json({
        success:true,
        message:"Application submitted successfully",
        data:populatedApplication
    });
});

//getMyApplications
const getMyApplications=asyncHandler(async(req,res)=>{
    // const filter={student:req.user._id};
    const filter={};

    if(req.query.status){
        const allowed=["pending","approved","rejected"];
        if(!allowed.includes(req.query.status)){
            throw new ApiError(
                400,
                "Status must be one of: pending , approved , rejected"
            );
        }
        filter.status=req.query.status;
    }

    const applications=await Application.find(filter)
        .populate({
            path:"project",
            select:"title domain deadline status createdBy",
            populate:{
                path:"createdBy",
                select:"name email department designation",
            },
        })
        .sort({createdAt:-1});
    res.status(200).json({
        success:true,
        count:applications.length,
        data:applications
    });
});


export {
    createApplication,
    getMyApplications
}
