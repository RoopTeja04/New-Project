const mongoose = require("mongoose");

const ProjectMembersSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    user_id: {
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
      required,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProjectMember", projectMemberSchema);
