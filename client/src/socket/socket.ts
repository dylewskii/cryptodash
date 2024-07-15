import { io } from "socket.io-client";
import { API_BASE_URL } from "@/config";

const URL = API_BASE_URL || "http://localhost:8000";
const socket = io(URL, {
  withCredentials: true,
});

export default socket;
