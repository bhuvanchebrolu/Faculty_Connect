import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ─── References ─────────────────────────────────────────────────
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },

    // The project the student applied to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },

    // ─── Application Form Fields ────────────────────────────────────
    // These are filled by the student at application time, creating a
    // complete snapshot that the professor reviews. Even if the student
    // later updates their profile, the professor sees exactly what was
    // submitted.

    // Basic Information
    applicantName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    applicantPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Academic Information
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year of study is required"],
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },

    branch: {
      type: String, // e.g. "CSE", "ECE", "MECH"
      required: [true, "Branch is required"],
      trim: true,
    },

    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA must be between 0 and 10"],
      max: [10, "CGPA must be between 0 and 10"],
    },

    // Application Content
    // Why the student wants to work on this project
    statementOfInterest: {
      type: String,
      required: [true, "Statement of interest is required"],
      trim: true,
      maxlength: [2000, "Statement of interest cannot exceed 2000 characters"],
    },

    // Relevant skills/experience
    skills: {
      type: String, // comma-separated or newline-separated list
      trim: true,
      default: "",
    },

    // Any prior research experience or relevant projects
    priorExperience: {
      type: String,
      trim: true,
      default: "",
    },

    // Resume / CV – stored as a Cloudinary URL
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
    },

    // Optional: portfolio, GitHub, LinkedIn links
    portfolioUrl: {
      type: String,
      trim: true,
      default: null,
    },

    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: null,
    },

    // ─── Status Lifecycle ───────────────────────────────────────────
    // pending  → awaiting professor review
    // approved → professor accepted the student
    // rejected → professor declined the student
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be one of: pending, approved, rejected",
      },
      default: "pending",
    },

    // ─── Email Trigger Flags ────────────────────────────────────────
    emailSentToProfessor: {
      type: Boolean,
      default: false,
    },

    emailSentToStudent: {
      type: Boolean,
      default: false,
    },

    // ─── Professor's optional feedback when rejecting/approving ─────
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt = when student applied; updatedAt = last status change
  }
);

// ─── Compound unique index: one application per student per project ─────────
applicationSchema.index(
  { student: 1, project: 1 },
  { unique: true }
);

// ─── Index for professor's dashboard: quickly fetch apps for a project ──────
applicationSchema.index({ project: 1, status: 1 });

// ─── Index for student's dashboard: quickly fetch own applications ──────────
applicationSchema.index({ student: 1, status: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE HOOK – runs BEFORE every save()
//   1. On brand-new applications: verify the project is still open and has slots,
//      enforce per-student application limit.
//   2. On status change to "approved": increment Project.enrolledCount and
//      auto-close the project when max slots are filled.
//   3. On status change to "rejected" (from "approved"): decrement enrolledCount
//      so the slot opens back up.
// ─────────────────────────────────────────────────────────────────────────────
applicationSchema.pre("save", async function (next) {
  try {
    const Project = mongoose.model("Project");

    // ── (A) Brand-new document ──────────────────────────────────────
    if (this.isNew) {
      // 1. Grab the project to validate state
      const project = await Project.findById(this.project);
      if (!project) {
        return next(new Error("Project not found"));
      }

      // 2. Project must be open and not expired
      if (project.status !== "open" || project.deadline < new Date()) {
        return next(
          new Error("Project is no longer accepting applications")
        );
      }

      // 3. Check remaining slots
      if (project.enrolledCount >= project.maxStudents) {
        return next(new Error("No open slots left for this project"));
      }

      // 4. Per-student limit: max 5 active (pending | approved) applications
      const MAX_ACTIVE_APPLICATIONS = 5;
      const activeCount = await mongoose.model("Application").countDocuments({
        student: this.student,
        status: { $in: ["pending", "approved"] },
      });

      if (activeCount >= MAX_ACTIVE_APPLICATIONS) {
        return next(
          new Error(
            `You can have at most ${MAX_ACTIVE_APPLICATIONS} active applications at a time`
          )
        );
      }
    }

    // ── (B) Status changed on an existing document ─────────────────
    if (!this.isNew && this.isModified("status")) {
      const project = await Project.findById(this.project);

      // Status moved → "approved"
      if (this.status === "approved") {
        // Increment enrolled count
        await Project.findByIdAndUpdate(this.project, {
          $inc: { enrolledCount: 1 },
        });

        // If the project is now full, close it
        if (project.enrolledCount + 1 >= project.maxStudents) {
          await Project.findByIdAndUpdate(this.project, {
            status: "closed",
          });
        }
      }

      // Status moved → "rejected" FROM "approved" (slot freed up)
      if (this.status === "rejected" && this.getPrevious && this.getPrevious("status") === "approved") {
        await Project.findByIdAndUpdate(this.project, {
          $inc: { enrolledCount: -1 },
        });

        // Re-open the project if it was closed due to being full
        // and the deadline hasn't passed
        if (project.status === "closed" && project.deadline > new Date()) {
          await Project.findByIdAndUpdate(this.project, {
            status: "open",
          });
        }
      }

      // Reset the student email flag so the new status email can fire
      this.emailSentToStudent = false;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// ─── Virtual: human-readable status label for the UI ───────────────────────
applicationSchema.virtual("statusLabel").get(function () {
  const labels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[this.status] || this.status;
});

applicationSchema.set("toJSON", { virtuals: true });
applicationSchema.set("toObject", { virtuals: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;