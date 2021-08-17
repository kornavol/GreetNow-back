const router = require("express").Router();
const recipientsControl = require("../controller/recipients");

router.get("/getAll", recipientsControl.getAll);
router.post("/new_record", recipientsControl.newRecord);
router.post("/update_record", recipientsControl.updateRecord);
router.post("/delete_record", recipientsControl.deleteRecord);



module.exports = router;
