const { Server } = require("socket.io");
const MessageModel = require("./Models/messageModel");
module.exports.setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineUserSocket = {};
  const disconnect = (socket) => {
    for (const [userId, id] of Object.entries(onlineUserSocket)) {
      if (id === socket.id) {
        delete onlineUserSocket[userId];
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = onlineUserSocket[message.sender];
    const recipientSocketId = onlineUserSocket[message.recipient];

    const createdMessage = await MessageModel.create(message);
    const messageData = await MessageModel.findById(createdMessage._id)
      .populate("sender", "id email firstname lastname image color")
      .populate("recipient", "id email firstname lastname image color");

    if (recipientSocketId)
      io.to(recipientSocketId).emit("recieveMessage", messageData);

    if (senderSocketId)
      io.to(senderSocketId).emit("recieveMessage", messageData);
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUserSocket[userId] = socket.id;
    } else {
      console.log("userId not provided during connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
