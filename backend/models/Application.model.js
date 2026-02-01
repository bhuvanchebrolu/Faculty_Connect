import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // The student who applied
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

    //  Application Content
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    resumeSnapshot: {
      type: String, 
      default: null,
    },

    //  Status Lifecycle
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

    //Email Trigger Flags
    emailSentToProfessor: {
      type: Boolean,
      default: false, 
    },

    emailSentToStudent: {
      type: Boolean,
      default: false,
    },

    // Professor's optional feedback when rejecting
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

// Compound unique index: one application per student per project
applicationSchema.index(
  { student: 1, project: 1 },
  { unique: true }
);

// Index for professor's dashboard
applicationSchema.index({ project: 1, status: 1 });

//Index for student's dashboard
applicationSchema.index({ student: 1, status: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE HOOK – runs BEFORE every save()
//   1. On brand-new applications: snapshot the resume, verify the project is
//      still open and has slots, enforce per-student application limit.
//   2. On status change to "approved": increment Project.enrolledCount and
//      auto-close the project when max slots are filled.
//   3. On status change to "rejected" (from "approved"): decrement enrolledCount
//      so the slot opens back up.
// ─────────────────────────────────────────────────────────────────────────────
applicationSchema.pre("save", async function (next) {
  try {
    const Project = mongoose.model("Project");
    const User = mongoose.model("User");

    //(A) Brand-new document
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

      // 4. Per-student limit
      const MAX_ACTIVE_APPLICATIONS = 15;
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

      const student = await User.findById(this.student).select("resumeUrl");
      if (student && student.resumeUrl) {
        this.resumeSnapshot = student.resumeUrl;
      }
    }

    //(B) Status changed on an existing document
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
      if (this.status === "rejected" && this.getPrevious("status") === "approved") {
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

//Virtual: human-readable status label for the UI
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