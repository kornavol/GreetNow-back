const router = require("express").Router();
const recipientsControl = require("../controller/recipients");
const {tokenDecription} = require("../middleware/tokenDec");

router.get("/getAll", tokenDecription, recipientsControl.getAll);
router.post("/new_record", tokenDecription, recipientsControl.newRecord);
router.post("/update_record", tokenDecription, recipientsControl.updateRecord);
router.post("/delete_record", tokenDecription, recipientsControl.deleteRecord);

module.exports = router;
