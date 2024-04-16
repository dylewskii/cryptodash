const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());

app.use("/api", (req, res, next) => {
  res.json({ coins: ["coin1", "coin2", "coin3"] });
});

app.listen(PORT, () => {
  console.log(`Express listening on port: ${PORT}`);
});
