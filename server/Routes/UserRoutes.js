const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  CreateAccount,
  Login,
  CheckSession,
  UploadProfilePicture,
  uploadVideo,
} = require("../Controllers/UserController");

const UserRoutes = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new Error("Only JPEG and PNG images are allowed"));
  },
});

const uploadProfilePicture = (req, res, next) => {
  upload.single("profilePicture")(req, res, (error) => {
    if (!error) {
      return next();
    }

    const message = error.message || "Profile picture upload failed";
    const details = error.error || error;

    return res.status(error instanceof multer.MulterError ? 400 : 502).json({
      message,
      error: details,
    });
  });
};

UserRoutes.post("/create", CreateAccount);
UserRoutes.post("/login", Login);
UserRoutes.get("/check-session", CheckSession);

UserRoutes.post(
  "/profile-picture/:userID",
  uploadProfilePicture,
  UploadProfilePicture,
);

UserRoutes.post("/video/:userID", uploadVideo);

module.exports = UserRoutes;
