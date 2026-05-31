const express = require("express");
const {
  invite,
  invitationRequest,
} = require("../Controllers/InvitationController");

const InvitationRouter = express.Router();

InvitationRouter.post("/", invite);
InvitationRouter.post("/respond", invitationRequest);

module.exports = InvitationRouter;
