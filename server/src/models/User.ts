import mongoose from "mongoose";
const { Schema } = mongoose;

interface PortfolioValue {
  timestamp: Date;
  value: number;
}

interface PortfolioItem {
  id: string;
  amount: number;
  addedAt: Date;
}

interface UserType {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  portfolio: PortfolioItem[];
  portfolioValues: PortfolioValue[];
  createdAt: Date;
  updatedAt: Date;
}

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

export const User = mongoose.model("User", userSchema);
export type { UserType, PortfolioItem, PortfolioValue };
