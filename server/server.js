// app
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// routers
const authRouter = require("./routes/auth");
const coinsRouter = require("./routes/coins");
const dataRouter = require("./routes/data");
const uploadRouter = require("./routes/upload");
const passport = require("passport");

require("./strategies/passportJwt");
require("dotenv").config();

// create express app & http server
const app = express();
const server = createServer(app);

// setup socket.io w/ http server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // allow cookies & auth headers with CORS
  })
);
app.use(passport.initialize());

// routes
app.use("/auth", authRouter);
app.use("/coins", coinsRouter);
app.use("/data", dataRouter);
app.use("/upload", uploadRouter);

// socket.io
app.set("socketio", io);

// start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
