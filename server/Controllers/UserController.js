const User = require("../Models/UserModel");
const Company = require("../Models/CompanyModel");
const bcrypt = require("bcryptjs");
const CompanyMembers = require("../Models/CompanyMembersModel");

exports.CreateAccount = async (req, res) => {
  const {
    name,
    email,
    password,
    companyName,
    website,
    description,
    designation,
  } = req.body;

  try {
    const FindEmail = await User.findOne({ email });

    if (!FindEmail)
      return res.status(401).json({ message: "Email already Exists!" });

    const FindCompany = await Company.findOne({ companyName });

    if (!FindCompany)
      return res.status(401).json({ message: "Company Name Already Exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const newCompany = await Company.create({
      companyName,
      website,
      description,
      ownerID: newUser._id,
    });

    await newCompany.save();

    const newCompanyMembers = await CompanyMembers.create({
      companyID: newCompany._id,
      userID: newUser._id,
      role: "Admin",
      designation,
    });

    await newCompanyMembers.save();

    req.session.userId = newUser._id;
    req.session.email = newUser.email;

    return res
      .status(200)
      .json({ message: "Profile & Company Created SuccessFully..." });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const FindAccount = await User.findOne({ email });

    if (!FindAccount)
      return res.status(401).json({ message: "Email Not Founded" });

    const checkPassword = await bcrypt.compare(password, FindAccount.password);

    if (!checkPassword)
      return res
        .status(401)
        .json({ message: "password not matched try again" });

    const FindCompanyMember = await CompanyMembers.find({
      userID: FindAccount._id,
    }).select("role");

    req.session.userId = FindAccount._id;
    req.session.email = FindAccount.email;

    return res
      .status(200)
      .json({ message: "Login successfull", FindCompanyMember });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
