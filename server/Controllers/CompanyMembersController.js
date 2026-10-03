const CompanyMembers = require("../Models/CompanyMembersModel");

exports.getCompanyMembers = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid company ID" });
  }

  try {
    const members = await CompanyMembers.find({ companyID: id }).populate(
      "userID",
      "_id name email role avatar",
    );

    if (!members) {
      return res
        .status(404)
        .json({ success: false, message: "No members found" });
    }

    return res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      members,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
