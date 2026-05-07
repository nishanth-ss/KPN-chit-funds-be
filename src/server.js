const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});