"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const data_1 = __importDefault(require("./routes/data"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const ORIGIN_URL = process.env.ORIGIN_URL || "http://localhost:5173";
// express app & http server
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
// socket.io w/ http server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [ORIGIN_URL],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// db connection
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
// middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [ORIGIN_URL],
    credentials: true, // allow cookies & auth headers with CORS
}));
app.use(passport_1.default.initialize());
// routes
app.use("/auth", auth_1.default);
app.use("/portfolio", portfolio_1.default);
app.use("/data", data_1.default);
app.use("/upload", upload_1.default);
// socket.io
app.set("socketio", io);
// start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Express listening on port: ${PORT}`);
});
