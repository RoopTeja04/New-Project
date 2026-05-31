const mongoose = require("mongoose");

const CompanyMembersSchema = new mongoose.Schema(
  {
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Sub-Admin", "Member"],
      default: "Admin",
    },
    designation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CompanyMembers", CompanyMembersSchema);
