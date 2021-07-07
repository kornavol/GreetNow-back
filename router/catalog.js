const router = require("express").Router();
const textsControl = require('../controller/texts')
const picturesControl = require('../controller/pictures')

router.get("/getTexts",  textsControl.getAll);
router.get("/save",  textsControl.saveText);

router.get("/getPictures",  picturesControl.getAll);

module.exports = router;
