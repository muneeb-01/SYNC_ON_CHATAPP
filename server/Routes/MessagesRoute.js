const express = require("express");
const { verifyToken } = require("../middlewares/auth-middlewares");
const { getMessages } = require("../Controller/MessgaesController");

const router = express.Router();

router.post("/get-messages", verifyToken, getMessages);

module.exports = router;
