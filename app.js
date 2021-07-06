const express = require("express");
const app = express();
const hbs = require("hbs");

require("dotenv").config();

const connectDB = require("./config/db");

const port = process.env.PORT || 8080;

connectDB();

/* CrossDomain setup */
let allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
};

app.listen(port, () => console.log(`Server started to run on ${port}`));
