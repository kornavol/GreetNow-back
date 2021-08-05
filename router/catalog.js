const router = require("express").Router();
const textsControl = require('../controller/texts')
const picturesControl = require('../controller/pictures')
const {convertIds} = require('../middleware/namesToId')

router.get("/getTexts", convertIds, textsControl.getAll);
// router.get("/save",  textsControl.saveText);
router.get("/getPictures", convertIds, picturesControl.getAll);

module.exports = router;
