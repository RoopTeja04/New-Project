const express = require("express");
const {
  CreateProject,
  GetProjectDetails,
  GetProjectByCompany,
  GetProjectStats,
  UpdateProject,
  DeleteProject,
} = require("../Controllers/ProjectsController");

const ProjectRouter = express.Router();

ProjectRouter.post("/", CreateProject);

ProjectRouter.get("/:projectID", GetProjectDetails);
ProjectRouter.get("/total-projects/:companyID", GetProjectByCompany);
ProjectRouter.get("/stats/:companyID", GetProjectStats);

ProjectRouter.patch("/:projectID", UpdateProject);

ProjectRouter.delete("/:projectID", DeleteProject);

module.exports = ProjectRouter;
