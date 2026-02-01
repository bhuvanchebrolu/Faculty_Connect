import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    // Common
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Enforces @nitt.edu.in domain at the schema level
      match: [
        /^[a-zA-Z0-9._-]+@nitt\.edu\.in$/,
        "Only @nitt.edu.in email addresses are allowed",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never returned in queries by default
    },

    //Role & Access 
    role: {
      type: String,
      enum: {
        values: ["student", "professor", "admin"],
        message: "Role must be one of: student, professor, admin",
      },
      required: [true, "Role is required"],
    },

    

    // ─── Student-specific Fields ──────────────────────────────────
    // Roll number is unique per student; only relevant when role === "student"
    rollNumber: {
      type: String,
      trim: true,
      default: null,
    },

    year: {
      type: Number, 
      default: null,
    },

    branch: {
      type: String, 
      trim: true,
      default: null,
    },

    resumeUrl: {
      type: String,
      default: null,
    },

    // ─── Professor-specific Fields ────────────────────────────────
    department: {
      type: String, 
      trim: true,
      default: null,
    },

    designation: {
      type: String, 
      trim: true,
      default: null,
    },

  },
  {
    timestamps: true, // createdAt & updatedAt handled automatically
  }
);

// ─── Compound unique index: rollNumber is unique only among students
// Sparse index so that nulls (professors / admins) are ignored
userSchema.index(
  { rollNumber: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { role: "student" },
  }
);

module.exports = mongoose.model("User", userSchema);