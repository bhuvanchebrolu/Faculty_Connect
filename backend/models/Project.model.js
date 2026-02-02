import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },

    domain: {
      type: String,
      required: [true, "Domain is required"],
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "A project must belong to a professor"],
    },

    maxStudents: {
      type: Number,
      required: [true, "Maximum student slots are required"],
      min: [1, "At least one slot must be available"],
      default: 1,
    },

    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      required: [true, "A project deadline is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Deadline must be a future date",
      },
    },

    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    attachmentUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────
projectSchema.index({ createdBy: 1, status: 1 });
projectSchema.index({ domain: 1 });

// ─── Virtuals ─────────────────────────────
projectSchema.virtual("hasOpenSlots").get(function () {
  return this.enrolledCount < this.maxStudents && this.status === "open";
});

projectSchema.virtual("isExpired").get(function () {
  return this.deadline < new Date();
});

// ─── Pre-save hook (sync or async safe) ──
projectSchema.pre("save", function () {
  if (this.deadline < new Date() && this.status === "open") {
    this.status = "closed";
  }
  // No next() needed because this is sync
});

// ─── Pre-find hook (async style) ──────────
projectSchema.pre("find", async function () {
  // Auto-close expired projects before any find
  await this.model.updateMany(
    { status: "open", deadline: { $lt: new Date() } },
    { $set: { status: "closed" } }
  );
  // No next() needed because this is async
});

// Include virtuals in JSON & objects
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
