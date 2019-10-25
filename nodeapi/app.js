const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");

const expressvalidation = require("express-validator");
dotenv.config();

//routes

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error :${err.message}`);
});

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressvalidation());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use(cookieParser()); //cookieparser.json
app.listen(process.env.PORT || 8000);
