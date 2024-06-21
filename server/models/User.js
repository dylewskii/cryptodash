const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioValueSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number },
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    portfolio: [
      {
        id: { type: String, required: true, trim: true },
        amount: { type: Number, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    portfolioValues: [portfolioValueSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
