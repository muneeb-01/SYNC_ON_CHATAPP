const express = require("express");
const ContactRouter = express.Router();
const { verifyToken } = require("../middlewares/auth-middlewares");
const {
  searchContacts,
  getContactsForDMList,
} = require("../Controller/ContactsController");

ContactRouter.post("/search", verifyToken, searchContacts);
ContactRouter.get(
  "/get-contacts-for-dm-list",
  verifyToken,
  getContactsForDMList
);

module.exports = ContactRouter;
