const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    taskID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    uploadedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Attachment", attachmentSchema);
