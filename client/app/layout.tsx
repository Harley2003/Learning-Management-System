"use client";

import {Poppins} from "next/font/google";
import {Josefin_Sans} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "./utils/Theme-provider";
import {Providers} from "./Provider";
import {useEffect, useState} from "react";
import {Pacifico} from "next/font/google";
import {Toaster} from "react-hot-toast";
import socketIO from "socket.io-client";
import Loader from "@/app/components/Loader/Loader";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketIo = socketIO(ENDPOINT, {transports: ["websocket"]});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins"
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Josefin"
});

const cursive = Pacifico({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-Cursive"
});

export default function RootLayout({
                                       children
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${poppins.variable} ${josefin.variable} ${cursive.variable} bg-white dark:bg-gray-900 duration-300 transition-colors`}
        >
        <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SocketProvider>
                    {children}
                </SocketProvider>
                <Toaster position="top-center" reverseOrder={false}/>
            </ThemeProvider>
        </Providers>
        </body>
        </html>
    );
}

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleConnect = () => {
            console.log("Connected to socket server");
            setLoading(false);
        };

        const handleConnectError = (error: Error) => {
            console.error("Socket connection error:", error);
            setLoading(false);
        };

        socketIo.on("connect", handleConnect);
        socketIo.on("connect_error", handleConnectError);

        return () => {
            socketIo.off("connect", handleConnect);
            socketIo.off("connect_error", handleConnectError);
            socketIo.disconnect();
            console.log("Disconnected from socket server");
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <div>
            {loading ? <Loader/> : children}
        </div>
    );
};
