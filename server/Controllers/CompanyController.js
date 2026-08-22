const Company = require("../Models/CompanyModel");

exports.GetCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const FindCompany = await Company.findOne({ ownerID: id });

    if (!FindCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({ FindCompany });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.UpdateCompany = async (req, res) => {
  const { data } = req.body;
  const { id } = req.params;

  try {
    const FindCompany = await Company.findOne({ ownerID: id });

    if (!FindCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    const UpdatedCompany = await Company.findOneAndUpdate(
      { ownerID: id },
      { $set: data },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: "Company Data Updated Successfully",
      UpdatedCompany,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
