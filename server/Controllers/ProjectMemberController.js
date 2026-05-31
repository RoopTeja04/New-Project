const User = require("../Models/UserModel");
const ProjectMember = require("../Models/ProjectMembers");
const Projects = require("../Models/ProjectsModel");

exports.AddMember = async (req, res) => {
  const { projectID, userID, role } = req.body;

  try {
    const FindUser = await User.findById(userID);

    if (!FindUser) return res.status(404).json({ message: "User Not Found!" });

    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(404).json({ message: "Project Not Found!" });

    await ProjectMember.create({
      projectID,
      userID,
      role,
    });

    return res
      .status(200)
      .json({ message: "Project Member Added Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.RemoveMember = async (req, res) => {
  const { memberID, projectID } = req.params;

  try {
    const FindMember = await ProjectMember.find({ _id: memberID, projectID });

    if (!FindMember)
      return res.status(404).json({ message: "Member Not Found!" });

    await ProjectMember.findOneAndDelete({
      _id: FindMember._id,
      projectID: FindMember.projectID,
    });

    return res
      .status(200)
      .json({ message: "Member Removed form this project" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.UpdateMember = async (req, res) => {
  const { memberID } = req.params;
  const { role } = req.body;

  try {
    const FindMember = await ProjectMember.findById(memberID);

    if (!FindMember)
      return res.status(404).json({ message: "Member Not Found!" });

    await ProjectMember.findByIdAndUpdate(memberID, { role }, { new: true });

    return res
      .status(200)
      .json({ message: "Project Member Updated Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetMember = async (req, res) => {
  const { memberID } = req.params;

  try {
    const FindMember = await ProjectMember.findById(memberID).populate(
      "userID",
      "-password",
    );

    if (!FindMember)
      return res.status(404).json({ message: "Member Not Found" });

    return res
      .status(200)
      .json({ message: "Member Found Successfully", Member: FindMember });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
