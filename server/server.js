require("dotenv").config();
const express = require("express");
const dbConnect = require("./dbConnect");
const movieRoutes = require("./routes/movies");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();

dbConnect();

const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000, // 1 hour
    message: "Too many requests from this IP, please try again after an hour"
})

app.use("/api",limiter);
app.use(express.json());
app.use(cors());

app.use("/api", movieRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
