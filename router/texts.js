const router = require("express").Router();
const textsControl = require('../controller/texts')

router.get("/media-catalog",  textsControl.getAll);
router.get("/media-catalog-save",  textsControl.saveText);

module.exports = router;
