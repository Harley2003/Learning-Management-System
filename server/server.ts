require("dotenv").config();
import { app } from "./app";
import { initSocketServer } from "./socketServer";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";

// socket.io config
const server = http.createServer(app);

// create server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is connected with port ${PORT}`);
  connectDB();
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

initSocketServer(server);
