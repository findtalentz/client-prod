import Cookies from "js-cookie";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  auth: {
    token: Cookies.get("token"),
  },
  autoConnect: false,
});

export default socket;
