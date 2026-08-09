const Projects = require("../Models/ProjectsModel");
const Company = require("../Models/CompanyModel");
const User = require("../Models/UserModel");
const Columns = require("../Models/ColumnsModel");
const ProjectMembers = require("../Models/ProjectMembers");
const Task = require("../Models/TaskModel");
const ActivityLog = require("../Models/ActivityLogs");

exports.CreateProject = async (req, res) => {
  const {
    companyID,
    ownerID,
    name,
    description,
    techStack,
    projectLink,
    projectMembersData,
  } = req.body;

  try {
    const FindCompany = await Company.findById(companyID);

    if (!FindCompany)
      return res.status(404).json({ message: "Company Not Found!" });

    const FindUser = await User.findById(ownerID);

    if (!FindUser) return res.status(404).json({ message: "User Not Found!" });

    const newProject = await Projects.create({
      companyID,
      ownerID,
      name,
      description,
      techStack,
      projectLink,
    });

    if (
      projectMembersData.length > 0 &&
      Array.isArray(projectMembersData) &&
      projectMembersData
    ) {
      const membersData = projectMembersData.map((member) => ({
        projectID: newProject._id,
        userID: member.userID,
        role: member.role,
      }));

      await ProjectMembers.insertMany(membersData);
    }

    const defaultColumns = ["TODO", "IN PROGRESS", "TESTING", "DONE"];

    const columnsData = defaultColumns.map((title, index) => ({
      projectID: newProject._id,
      title,
      position: index + 1,
    }));

    await Columns.insertMany(columnsData);

    return res
      .status(200)
      .json({ message: "Project Created Successfully", newProject });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetProjectDetails = async (req, res) => {
  const { projectID } = req.params;

  try {
    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(404).json({ message: "Project Not Found" });

    const ProjectMembersDeatils = await ProjectMembers.find({
      projectID,
    }).populate("userID");

    const ColumnsDetails = await Columns.find({ projectID });

    return res.status(200).json({
      message: "Project Found Successfully",
      project: FindProject,
      TotalMembers: ProjectMembersDeatils.length,
      members: ProjectMembersDeatils,
      TotalColumns: ColumnsDetails.length,
      columns: ColumnsDetails,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetProjectByCompany = async (req, res) => {
  const { companyID } = req.params;

  try {
    const FindProjects = await Projects.find({ companyID }).populate(
      "ownerID",
      "-password",
    );

    if (!FindProjects)
      return res.status(404).json({ message: "No Projects Found" });

    return res.status(200).json({
      message: "Projects Found Successfully",
      Total: FindProjects.length,
      Projects: FindProjects,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.GetProjectStats = async (req, res) => {
  const { companyID } = req.params;

  try {
    const FindProjects = await Projects.find({ companyID });

    if (!FindProjects)
      return res.status(404).json({ message: "No Projects Found" });

    const payload = {
      totalProjects: FindProjects.length,
      notStartedProjects: FindProjects.filter(
        (project) => project.status === "Not-Started",
      ).length,
      startedProjects: FindProjects.filter(
        (project) => project.status === "Started",
      ).length,
      inprogressProjects: FindProjects.filter(
        (project) => project.status === "In-Progress",
      ).length,
      almostCompletedProjects: FindProjects.filter(
        (project) => project.status === "Almost Completed",
      ).length,
      finalStageProjects: FindProjects.filter(
        (project) => project.status === "Final Stage",
      ).length,
      completedProjects: FindProjects.filter(
        (project) => project.status === "Completed",
      ).length,
    };

    return res.status(200).json({
      message: "Project Stats Retrieved Successfully",
      stats: payload,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.UpdateProject = async (req, res) => {
  const { projectID } = req.params;
  const { status } = req.body;

  try {
    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(400).json({ message: "Project Not Found" });

    FindProject.status = status;

    await FindProject.save();

    return res.status(201).json({
      message: "Project Status Updated Successfully",
      projectID: FindProject._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.DeleteProject = async (req, res) => {
  const { projectID } = req.params;

  try {
    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(400).json({ message: "Project Not Found" });

    await Projects.findByIdAndDelete(projectID);
    await ProjectMembers.deleteMany({ projectID });
    await Columns.deleteMany({ projectID });
    await Task.deleteMany({ projectID });
    await ActivityLog.deleteMany({ projectID });

    return res.status(200).json({
      message: "Project Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.updateProjectDetails = async (req, res) => {
  const { projectID } = req.params;
  const { payload } = req.body;

  try {
    const FindProject = await Projects.findById(projectID);

    if (!FindProject)
      return res.status(400).json({ message: "Project Not Found" });

    const updatedProject = await Projects.findByIdAndUpdate(
      projectID,
      { $set: payload },
      { new: true },
    );

    return res.status(200).json({
      message: "Project Details Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
