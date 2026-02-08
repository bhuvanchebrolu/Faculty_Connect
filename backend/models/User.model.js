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
        /^[a-zA-Z0-9._-]+@nitt\.edu$/,
        "Only @nitt.edu email addresses are allowed",
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

// ─── Pre-save: hash password before storing ────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only re-hash if the password field was actually changed
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Instance method: compare raw password against the stored hash ─────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Virtual: full display name (can extend later with title for professors)
userSchema.virtual("displayName").get(function () {
  if (this.role === "professor" && this.designation) {
    return `${this.designation} ${this.name}`;
  }
  return this.name;
});

// Make virtuals appear in JSON / toObject output
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });


const User = mongoose.model("User", userSchema);

export default User;