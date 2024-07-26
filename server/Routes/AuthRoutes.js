const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require("../middlewares/auth-middlewares");
const path = require("path");
const {
  signup,
  login,
  getUserInfo,
  updateProfileInfo,
  addProfileImageController,
  removeProfileImage,
  logout,
} = require("../Controller/AuthController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("profile-image");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/user-info", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateProfileInfo);
router.post("/remove-profile-image", verifyToken, removeProfileImage);
router.post(
  "/add-profile-image",
  verifyToken,
  upload,
  addProfileImageController
);

module.exports = router;
