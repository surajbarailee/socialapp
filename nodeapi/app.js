const express = require('express')
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()


//routes

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log("DB connected"))

mongoose.connection.on('error', err => {
    console.log(`DB connection error :${err.message}`);
})

const postRoutes = require('./routes/post')

app.use(morgan('dev'));
app.use(bodyParser.json())


app.use("/", postRoutes)
app.listen(process.env.PORT || 8000)