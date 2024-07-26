const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const path = require("path");
const fs = require("fs");

const maxAge = 1000 * 60 * 60 * 24 * 3;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and Password is required");

    const validity = await userModel.find({ email });
    if (validity) return res.status(400).send("User alredy exist");

    const user = await userModel.create({
      email,
      password,
    });
    res.cookie(
      "jwt",
      createToken(user.email, user._id, {
        maxAge,
        secure: true,
        sameSite: "none",
      })
    );
    return res.status(201).json({
      user: {
        email: user.email,
        id: user._id,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and Password is required");

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const auth = await compare(password, user.password);
    if (!auth) return res.status(404).send("Incorrect Password");

    res.cookie(
      "jwt",
      createToken(email, user?._id, {
        maxAge,
        secure: true,
        sameSite: "none",
      })
    );

    return res.status(201).json({
      user: {
        email: user.email,
        id: user._id,
        profileSetup: user.profileSetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).send("User not found...");

    return res.status(200).json({
      user: {
        email: user.email,
        id: user._id,
        profileSetup: user.profileSetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.updateProfileInfo = async (req, res) => {
  try {
    const { userId } = req;
    const { firstname, lastname, color } = req.body;
    if (!firstname || !lastname)
      return res
        .status(400)
        .send("firstname, lastname and color must required.");

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      user: {
        email: user.email,
        id: user._id,
        profileSetup: user.profileSetup,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.addProfileImageController = async (req, res) => {
  try {
    if (!req.file) return res.status(404).send("File is required");
    const { userId } = req;
    const { Host } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        image: `${Host}/uploads/profiles/${req.file.filename}`,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const filename = path.basename(req.body.imageUrl);
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "profiles",
      filename
    );
    fs.unlinkSync(filePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to delete the file.");
      }
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { image: null } },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).send("Unauthorized user");

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    res.status(200).send("Logout successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal sever error...");
  }
};
