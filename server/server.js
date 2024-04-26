const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const passport = require("passport");
require("./strategies/passportLocal");
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
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true - only appropriate if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
