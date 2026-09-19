const express = require("express");
const {
  AddMember,
  RemoveMember,
  UpdateMember,
  GetMember,
  GetProjectMembers,
} = require("../Controllers/ProjectMemberController");

const ProjectMemberRouter = express.Router();

ProjectMemberRouter.post("/", AddMember);
ProjectMemberRouter.delete("/:memberID/:projectID", RemoveMember);
ProjectMemberRouter.patch("/:memberID", UpdateMember);
ProjectMemberRouter.get("/:memberID", GetMember);

ProjectMemberRouter.get("/members/:projectID", GetProjectMembers);

module.exports = ProjectMemberRouter;
