import {createContext, useContext} from "react";
import {Socket} from "socket.io-client";

// Tạo context để cung cấp socket cho toàn bộ ứng dụng
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        console.warn("Socket is not connected");
    }
    return socket;
};