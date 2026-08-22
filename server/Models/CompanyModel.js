const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      default: "",
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    location: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    socialLinks: {
      platform: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
