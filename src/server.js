const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});