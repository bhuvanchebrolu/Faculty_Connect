const mongoose = require("mongoose");

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

    // Domain / area of the project – used for search & filter
    domain: {
      type: String,
      required: [true, "Domain is required"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // populated with the User (professor) document
      required: [true, "A project must belong to a professor"],
    },
    // How many students can be accepted for this project
    maxStudents: {
      type: Number,
      required: [true, "Maximum student slots are required"],
      min: [1, "At least one slot must be available"],
      default: 1,
    },

    // Current count of *approved* applications – maintained via
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // The date after which new applications are no longer accepted
    deadline: {
      type: Date,
      required: [true, "A project deadline is required"],
      validate: {
        validator: function (value) {
          // Deadline must be in the future at the time of creation/update
          return value > new Date();
        },
        message: "Deadline must be a future date",
      },
    },

    // ─── Status Lifecycle ───────────────────────────────────────────
    // open     → accepting applications
    // closed   → deadline passed OR professor manually closed it
    // completed → project is finished
    status: {
      type: String,
      enum: {
        values: ["open", "closed", "completed"],
        message: "Status must be one of: open, closed, completed",
      },
      default: "open",
    },

    // ─── Extras ─────────────────────────────────────────────────────
    // Any specific skills or technologies the professor is looking for
    skillsRequired: {
      type: [String], // e.g. ["React", "Node.js", "MongoDB"]
      default: [],
    },

    // Optional: a detailed PDF or document the professor attaches
    attachmentUrl: {
      type: String, 
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//  Compound index: quickly filter by professor + status
projectSchema.index({ createdBy: 1, status: 1 });

//Index on domain for the search & filter requirement
projectSchema.index({ domain: 1 });

//Virtual: whether the project still has open slots
projectSchema.virtual("hasOpenSlots").get(function () {
  return this.enrolledCount < this.maxStudents && this.status === "open";
});

//Virtual: whether the deadline has passed 
projectSchema.virtual("isExpired").get(function () {
  return this.deadline < new Date();
});

//Pre-save hook: auto-close the project if the deadline has passed 
projectSchema.pre("save", function (next) {
  if (this.deadline < new Date() && this.status === "open") {
    this.status = "closed";
  }
  next();
});

//Pre-find hook: auto-close expired open projects on every query
projectSchema.pre("find", function (next) {
  this.updateMany(
    { status: "open", deadline: { $lt: new Date() } },
    { $set: { status: "closed" } }
  );
  next();
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);