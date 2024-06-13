import { io } from "socket.io-client";

const URL = "http://localhost:8000";
const socket = io(URL, {
  withCredentials: true,
});

export default socket;
