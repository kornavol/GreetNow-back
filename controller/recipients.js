const multer = require('multer');
const User = require("../model/User");

/* ... multer settings goes here */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, 'a' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage }).single('file');


exports.newRecord = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log('err', err);
        }

        const userId = req.query.userid;
        const recipient = req.body;
        const user = await User.findById(userId);

        user.recipients.unshift(recipient);

        const currRecipient = user.recipients[0];

        await user.save((err, doc) => {
            if (err) {
                console.log(err);
                res.send({ status: "failed", message: err });
            } else {
                res.send({
                    status: "success",
                    message: "Contact created successfully",
                    data: currRecipient,
                });
            }
        });
    })
};

exports.getAll = (req, res) => {
    const userId = req.query.userid;

    User.findById(userId, (err, doc) => {
        if (err) {
            res.status(500).send({ status: "failed", message: err });
        } else {
            const recipients = doc.recipients
            res.send({
                status: "success",
                message: "All data fetched successfully",
                data: recipients,
            });
        }
    });
};

exports.updateRecord = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log('err', err);
        }

        const userId = req.query.userid;
        const newRecipient = req.body;
        const recipId = req.body._id

        const user = await User.findById(userId);

        const index = user.recipients.findIndex(
            (element) => element._id == recipId
        );

        const oldRecipient = user.recipients[index]

        newRecipient._id = oldRecipient._id
        /* Becouse I don't now how appent an object */
        newRecipient.autoCards = oldRecipient.autoCards

        if (index || index === 0) {
            user.recipients[index] = newRecipient;
        }

        await user.save((err, doc) => {
            if (err) {
                console.log(err);
                res.send({ status: "failed", message: err });
            } else {
                res.send({
                    status: "success",
                    message: "Contact updated successfully",
                    data: {
                        newRecipient,
                        oldRecipient,
                    },
                });
            }
        });
    });
};

exports.deleteRecord = async (req, res) => {
    const userId = req.query.userid;
    const id = req.body._id
    const user = await User.findById(userId);

    user.recipients.id(id).remove()

    await user.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({ status: "failed", message: err });
        } else {
            res.send({
                status: "success",
                message: "Contact deleted successfully",
            });
        }
    });
}
