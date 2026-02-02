import mongoose from "mongoose";
import User from "../models/User.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/faculty-connect");

const students = await User.find({ role: "student" }).select("-password");
console.log(students);

await mongoose.disconnect();
