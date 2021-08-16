const router = require("express").Router();
const recipientsControl = require("../controller/recipients");
// const {convertIds} = require('../middleware/namesToId')

router.post("/new_record", recipientsControl.newRecord);

module.exports = router;
