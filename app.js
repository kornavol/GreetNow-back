const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");

require("dotenv").config();



const connectDB = require("./config/db");
const catalog = require("./router/catalog");

const port = process.env.PORT || 8080;

connectDB();

/* allow to serve stativc files (in this case - pictures)  */
app.use(express.static(path.join(__dirname, 'public')));

/* allow to get json format */
app.use(express.json());

/* CrossDomain setup */
let allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
};

app.use(allowCrossDomain);

app.use("/media-catalog", catalog);

app.listen(port, () => console.log(`Server started to run on ${port}`));
