const express = require("express");
const {
  AddMember,
  RemoveMember,
  UpdateMember,
  GetMember,
} = require("../Controllers/ProjectMemberController");

const ProjectMemberRouter = express.Router();

ProjectMemberRouter.post("/", AddMember);
ProjectMemberRouter.delete("/:memberID/:projectID", RemoveMember);
ProjectMemberRouter.patch("/:memberID", UpdateMember);
ProjectMemberRouter.get("/:memberID", GetMember);

module.exports = ProjectMemberRouter;