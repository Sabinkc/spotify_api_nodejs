const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth_routes");
const musicRoutes = require("./routes/music_routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

module.exports = app;
