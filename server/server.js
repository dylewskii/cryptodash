const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
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
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
