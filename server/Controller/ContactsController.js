const mongoose = require("mongoose");
const UserModel = require("../Models/userModel");
const MessagesModel = require("../Models/messageModel");

module.exports.searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null)
      return res.status(404).send("SearchTerm is required");

    // removing all special characters from searchTerm
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[/]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await UserModel.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstname: regex }, { lastname: regex }, { email: regex }] },
      ],
    }).select(["-password"]);
    return res.status(200).json({ contacts });
  } catch (error) {}
};

module.exports.getContactsForDMList = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await MessagesModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstname: "$contactInfo.firstname",
          lastname: "$contactInfo.lastname",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {}
};
