const express = require("express");
const app = express();
const path = require("path");

require('dotenv').config({path : './config.env'});

const connectDB = require("./config/db");
const catalog = require("./router/catalog");
const idToDb = require('./config/id-name')

// const test1 = require('./middleware/conformity')

const port = process.env.PORT || 8080;

connectDB();

/* allow to serve stativc files (in this case - pictures)  */
app.use(express.static(path.join(__dirname, 'public')));

/* allow to get json format */
app.use(express.json());

/* CrossDomain setup */
let allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
};

/* !Q:
    1. Ask Buelent about  situation, with promise
    2. Ask about my initial idea. Get conformity table once and send it to
    midleware. */
idToDb.convertIds('events').then(respond => app.locals.eventsLookupTab =
                                     respond)
idToDb.convertIds('categories')
    .then(respond => app.locals.categoriesLookupTab = respond)

app.use(allowCrossDomain);

app.use("/media-catalog", catalog);
app.use('/auth', require('./router/auth'));
app.use('/private', require('./router/private'));

app.listen(port, () => console.log(`Server started to run on ${port}`));
