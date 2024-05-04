const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const coinsRouter = require("./routes/coins");
const passport = require("passport");
require("./strategies/passportJwt");
require("dotenv").config();

// app
const PORT = process.env.PORT || 8000;
const app = express();

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
    credentials: true, // allows sending of cookies & authorization headers with CORS
  })
);
app.use(passport.initialize());

// routes
app.use("/", authRouter);

app.use("/coins", coinsRouter);

app.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
