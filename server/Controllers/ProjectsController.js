const Projects = require("../Models/ProjectsModel");
const Company = require("../Models/CompanyModel");
const User = require("../Models/UserModel");
const Columns = require("../Models/ColumnsModel");
const ProjectMembers = require("../Models/ProjectMembers");

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

    const FindProjects = await Projects.find({ companyID }).populate("ownerID", "-password");

    if(!FindProjects)
      return res.status(404).json({ message: "No Projects Found" });

    return res.status(200).json({
      message: "Projects Found Successfully",
      Total: FindProjects.length,
      Projects: FindProjects,
    })


  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
