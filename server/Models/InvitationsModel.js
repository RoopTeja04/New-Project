const mongoose = require("mongoose");

const InvitationsSchema = new mongoose.Schema(
  {
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    invitedID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Accept", "Reject", "Pending"],
      default: "Pending",
    },
    expiresAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invitation", InvitationsSchema);
