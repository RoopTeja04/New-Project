const User = require("../Models/UserModel");
const Company = require("../Models/CompanyModel");
const bcrypt = require("bcryptjs");
const CompanyMembers = require("../Models/CompanyMembersModel");
const cloudinary = require("../config/cloudinary");

exports.CreateAccount = async (req, res) => {
  const {
    name,
    email,
    password,
    companyName,
    website,
    description,
    designation,
  } = req.body;

  try {
    const FindEmail = await User.findOne({ email });

    if (FindEmail)
      return res.status(401).json({ message: "Email already Exists!" });

    const FindCompany = await Company.findOne({ companyName });

    if (FindCompany)
      return res.status(401).json({ message: "Company Name Already Exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const newCompany = await Company.create({
      companyName,
      website,
      description,
      ownerID: newUser._id,
    });

    await newCompany.save();

    const newCompanyMembers = await CompanyMembers.create({
      companyID: newCompany._id,
      userID: newUser._id,
      role: "Admin",
      designation,
    });

    await newCompanyMembers.save();

    req.session.userId = newUser._id;
    req.session.email = newUser.email;

    return res
      .status(200)
      .json({ message: "Profile & Company Created SuccessFully..." });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const FindAccount = await User.findOne({ email });

    if (!FindAccount)
      return res.status(401).json({ message: "Email Not Founded" });

    const checkPassword = await bcrypt.compare(password, FindAccount.password);

    if (!checkPassword)
      return res
        .status(401)
        .json({ message: "password not matched try again" });

    const FindCompanyMember = await CompanyMembers.find({
      userID: FindAccount._id,
    }).select("role");

    req.session.userId = FindAccount._id;
    req.session.email = FindAccount.email;

    return res.status(200).json({
      message: "Login successfull",
      FindCompanyMember,
      userId: FindAccount._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.CheckSession = async (req, res) => {
  if (req.session && req.session.userId) {
    return res
      .status(200)
      .json({ isAuthenticated: true, userId: req.session.userId });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
};

exports.UploadProfilePicture = async (req, res) => {
  const { userID } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!req.file.path) {
      return res.status(500).json({
        message: "Cloudinary did not return an image URL",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { avatar: req.file.path },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
      CloudinaryData: req.file,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.uploadVideo = async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_chunked_stream(
        {
          resource_type: "video",
          chunk_size: 5 * 1024 * 1024,
          folder: "videos",
        },
        (error, uploadResult) => {
          if (error) {
            return reject(error);
          }

          return resolve(uploadResult);
        },
      );

      req.pipe(uploadStream);
    });

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { video: result.secure_url },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: "Video uploaded successfully",
      user: updatedUser,
      video: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        duration: result.duration,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
