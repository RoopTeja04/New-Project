const express = require("express");
const {
  invite,
  invitationRequest,
  GetInviteHistory,
  DeleteInvite,
} = require("../Controllers/InvitationController");

const InvitationRouter = express.Router();

InvitationRouter.post("/", invite);
InvitationRouter.post("/respond", invitationRequest);
InvitationRouter.get("/:companyID", GetInviteHistory);
InvitationRouter.delete("/:id", DeleteInvite);

module.exports = InvitationRouter;
