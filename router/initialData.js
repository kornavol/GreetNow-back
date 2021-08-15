const router = require("express").Router();
const dataControl = require('../controller/initialData')

router.get("/events", dataControl.events);
router.get("/categories", dataControl.categories);

module.exports = router;
