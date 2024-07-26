const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./Routes/AuthRoutes");
const contactRoutes = require("./Routes/ContactRoutes");
const messagesRoute = require("./Routes/MessagesRoute");
const path = require("path");
const { setupSocket } = require("./socket");

const app = express();
const port = process.env.PORT || 3002;
const databseUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads/profiles", express.static("./uploads/profiles"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoute);

const server = app.listen(port, () => {
  console.log("server is running");
});
setupSocket(server);

mongoose
  .connect(databseUrl)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err.message));
