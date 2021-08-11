const router = require("express").Router();
const cardsControl = require("../controller/cards");
// const {convertIds} = require('../middleware/namesToId')

router.get("/getCard", cardsControl.getCard);

module.exports = router;
