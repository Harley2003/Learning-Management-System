import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();

// create server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is connected with port ${PORT}`);
  connectDB();
});
