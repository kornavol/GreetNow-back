const router = require("express").Router();
const cardsControl = require("../controller/cards");
const { tokenDecription } = require("../middleware/tokenDec");

router.get("/getCard", tokenDecription, cardsControl.getCard);

router.get("/getAll", tokenDecription, cardsControl.getAll);
router.post("/new_record", tokenDecription, cardsControl.newRecord);
router.post("/update_record", tokenDecription,  cardsControl.updateRecord);
// router.delete("/delete_record", tokenDecription,  cardsControl.deleteRecord);

module.exports = router;
