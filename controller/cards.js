const cards = require("../model/cards");

exports.getCard = (req, res) => {
    const id = req.query.id;
    cards
        .findById(id)
        .populate("users")
        .exec((err, docs) => {
            if (err) {
                res.status(500).send({ status: "failed", message: err });
            } else {
                res.send({
                    status: "success",
                    message: `All data fetched successfuly`,
                    data: docs,
                });
            }
        });
};
