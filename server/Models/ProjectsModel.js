const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    projectLink: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "Not-Started",
        "Started",
        "In-Progress",
        "Almost Completed",
        "Final Stage",
        "Completed",
      ],
      default: "Not-Started",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Projects", ProjectSchema);
