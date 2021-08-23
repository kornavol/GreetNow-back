const User = require("../model/User");

exports.getCard = (req, res) => {
    const userId = req.query.userid;
    const cardId = req.query.id;

    console.log(userId);
    console.log(cardId);


    User.findById(userId, (err, doc) => {
        if (err) {
            res.status(500).send({ status: "failed", message: err });
        } else {
            const cards = doc.cards;
            const card = cards.find(card => card._id == cardId)

            if (card) {
                res.send({
                    status: "success",
                    message: "All data fetched successfully",
                    data: card,
                });    
            } else {
                res.send({
                    status: "failed",
                    message: `Card with id: ${cardId} not exist`,
                    data: card,
                });
            }
            
        }
    });
};


exports.getAll = (req, res) => {
    const userId = req.query.userid;

    User.findById(userId, (err, doc) => {
        if (err) {
            res.status(500).send({ status: "failed", message: err });
        } else {
            const cards = doc.cards;
            res.send({
                status: "success",
                message: "All data fetched successfully",
                data: cards,
            });
        }
    });
};

exports.newRecord = async (req, res) => {

        const userId = req.query.userid;
        const card = req.body;
        const user = await User.findById(userId);

        console.log(userId);
        console.log(card);

        user.cards.unshift(card);

        const currCard = user.cards[0];

        await user.save((err, doc) => {
            if (err) {
                console.log(err);
                res.send({ status: "failed", message: err });
            } else {
                res.send({
                    status: "success",
                    message: "Card created successfully",
                    data: currCard,
                });
            }
        });
};

exports.updateRecord = async (req, res) => {
    
        const userId = req.query.userid;
        const newCard = req.body;
        const cardId = req.body._id

        const user = await User.findById(userId);

        const index = user.cards.findIndex(
            (element) => element._id == cardId
        );

        const oldCard = user.cards[index]

        newCard._id = oldCard._id

        if (index || index === 0 ) {
            user.cards[index] = newCard;
        }

        await user.save((err, doc) => {
            if (err) {
                console.log(err);
                res.send({ status: "failed", message: err });
            } else {
                res.send({
                    status: "success",
                    message: "Card updated successfully",
                    data: {
                        newCard,
                        oldCard,
                    },
                });
            }
        });
};


exports.deleteRecord = async (req, res) => {
    const userId = req.query.userid;
    const id = req.body._id
    const user = await User.findById(userId);

    user.cards.id(id).remove()

    await user.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({ status: "failed", message: err });
        } else {
            res.send({
                status: "success",
                message: "Card deleted successfully",
            });
        }
    });
}
