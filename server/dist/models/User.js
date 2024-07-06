"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const portfolioValueSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    value: { type: Number },
});
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", userSchema);
