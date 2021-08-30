const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config({ path: "./config.env" });

const idToDb = require("./config/id-name");
const assistant = require("./config/assistent")

const connectDB = require("./config/db");

const catalog = require("./router/catalog");
const cards = require("./router/cards");
const data = require('./router/initialData')


const errorHandler = require("./middleware/error");

const port = process.env.PORT || 8080;

connectDB();

/* allow to serve stativc files (in this case - pictures)  */
app.use(express.static(path.join(__dirname, "public")));

/* allow to get json format */
app.use(express.json());

/* CrossDomain setup */
let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
};

idToDb
  .convertIds("events")
  .then((respond) => (app.locals.eventsLookupTab = respond));
idToDb
  .convertIds("categories")
  .then((respond) => (app.locals.categoriesLookupTab = respond));

/* Card assistant. One now, one in one day  */
assistant.cardAssistant(5)
setInterval(() => {
  assistant.cardAssistant(5)  
}, 86400000);


app.use(allowCrossDomain);

app.use("/media-catalog", catalog);
app.use("/auth", require("./router/auth"));
app.use("/private", require("./router/private"));
app.use("/cards", cards);
app.use("/data", data);
app.use("/recipients", require("./router/recipients") )

// error handler should be last piece of middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server started to run on ${port}`));
