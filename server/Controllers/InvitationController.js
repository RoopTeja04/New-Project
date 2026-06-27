const Company = require("../Models/CompanyModel");
const Invitation = require("../Models/InvitationsModel");
const User = require("../Models/UserModel");
const companyMembers = require("../Models/CompanyMembersModel");
const bcrypt = require("bcryptjs");

const sendInvite = require("../utils/sendInviteMail");

exports.invite = async (req, res) => {
  const { companyID, invitedID, email, role, designation } = req.body;

  try {
    const FindUser = await User.findById(invitedID);

    if (!FindUser) return res.status(404).json({ message: "User Not Found" });

    const FindCompany = await Company.findById(companyID);

    if (!FindCompany)
      return res.status(404).json({ message: "Company Not Found" });

    const FindInvite = await Invitation.findOne({ email });

    if (FindInvite)
      return res
        .status(401)
        .json({ message: "Invite already sent to this emailID" });

    const GeneratedToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await sendInvite({
      email,
      companyName: FindCompany.companyName,
      designation,
      token: GeneratedToken,
    });

    const NewInvite = await Invitation.create({
      companyID,
      invitedID,
      email,
      role,
      designation,
      token: GeneratedToken,

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await NewInvite.save();

    return res.status(200).json({ message: "Invite Sent Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.invitationRequest = async (req, res) => {
  const { token, status, password, name } = req.body;

  try {
    const FindInvite = await Invitation.findOne({ token });

    if (!FindInvite)
      return res.status(404).json({ message: "Invite Not Found" });

    if (FindInvite.expiresAt < Date.now())
      return res.status(400).json({ message: "Invite Expired" });

    if (status === "Accept") {
      await FindInvite.updateOne({ status, token: null });

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email: FindInvite.email,
        password: hashPassword,
      });

      await newUser.save();

      await companyMembers.create({
        companyID: FindInvite.companyID,
        userID: newUser._id,
        role: FindInvite.role,
        designation: FindInvite.designation,
      });

      return res
        .status(200)
        .json({ message: `Invitation ${status}ed Successfully` });
    }

    await FindInvite.updateOne({ status, token: null });

    return res
      .status(200)
      .json({ message: `Invitation ${status}ed Successfully` });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetInviteHistory = async (req, res) => {
  const companyID = req.params.companyID;

  try {
    if (!companyID)
      return res.status(401).json({ message: "Invalid company ID" });

    const findCompanyId = await Company.find({ _id: companyID });

    if (!findCompanyId)
      return res
        .status(401)
        .json({ message: "unAuthorized! company not found" });

    const InvitationHistory = await Invitation.find({
      companyID: companyID,
    }).populate("invitedID", "-password");

    return res
      .status(200)
      .json({ message: "Invite History Found", InvitationHistory });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
