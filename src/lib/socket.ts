import { io } from "socket.io-client";

const env = import.meta.env;

const socket = io(env.VITE_SERVER, {
  withCredentials: true,
});

export default socket;
