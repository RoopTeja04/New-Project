const express = require("express");
const {
  invite,
  invitationRequest,
  GetInviteHistory,
} = require("../Controllers/InvitationController");

const InvitationRouter = express.Router();

InvitationRouter.post("/", invite);
InvitationRouter.post("/respond", invitationRequest);
InvitationRouter.get("/:companyID", GetInviteHistory);

module.exports = InvitationRouter;
