const mongoose = require("mongoose");

const ProjectMembersSchema = new mongoose.Schema(
  {
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: [
        "Designer",
        "Developer",
        "SEO Manager",
        "Business Analyst",
        "Spectator",
      ],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProjectMember", ProjectMembersSchema);
