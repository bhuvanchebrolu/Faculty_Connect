import User from "../models/User.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";

//upload resume
const uploadResume = asyncHandler(async (req, res) => {
  const { resumeUrl } = req.body;

  if (!resumeUrl) {
    throw new ApiError(400, "resume URL is required");
  }
  const student = await User.findByIdAndUpdate(
    req.user._id,
    { resumeUrl },
    { new: true, runValidators: true }, // return the updated doc & validate
  ).select("-password"); // never send password back

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    data: student,
  });
});

//get all professors
const getAllProfessors = asyncHandler(async (req, res) => {
  
  const filter = { role: "professor" };

  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [
      { name: regex },
      { department: regex },
    ];
  }

  const professors = await User.find(filter)
    .select("-password") 
    .sort({ name: 1 }); 

  res.status(200).json({
    success: true,
    count: professors.length,
    data: professors,
  });
});

//get student profile
const getProfile = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id).select("-password");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, rollNumber, year, branch, profileImage } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (rollNumber !== undefined) updates.rollNumber = rollNumber;
  if (year !== undefined) updates.year = year;
  if (branch !== undefined) updates.branch = branch;
  if (profileImage !== undefined) updates.profileImage = profileImage;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const student = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: student,
  });
});

export {
    uploadResume,getAllProfessors,getProfile,updateProfile
}
