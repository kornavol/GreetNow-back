const router = require("express").Router();
const textsControl = require('../controller/texts')
const picturesControl = require('../controller/pictures')
const conformaty = require('../middleware/conformity')

router.get("/getTexts", conformaty.convertIds,   textsControl.getAll);
// router.get("/getTexts",   textsControl.getAll);
router.get("/save",  textsControl.saveText);

router.get("/getPictures",  picturesControl.getAll);

module.exports = router;
