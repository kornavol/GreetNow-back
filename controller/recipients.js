const User = require("../model/User");

exports.newRecord = async (req, res) => {
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
};

exports.getAll = (req, res) => {
    const userId = req.query.userid;

    User.findById(userId, (err, doc) => {
        if (err) {
            res.status(500).send({ status: "failed", message: err });
        } else {
            const recipients = doc.recipients;
            res.send({
                status: "success",
                message: "All data fetched successfully",
                data: recipients,
            });
        }
    });
};

exports.updateRecord = async (req, res) => {
    const newRecipient = req.body;
    const user = await User.findById("61111dbbcaed1572881e545a");
    

    const index = user.recipients.findIndex(
        (element) => element._id == "611a834a9910fb516851121c"
    );
    
    const oldRecipient = user.recipients[index]

    newRecipient._id = oldRecipient._id

    if (index) {
        console.log(index);
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
};

exports.deleteRecord = async (req, res) => {
    const id = req.body._id
    console.log(id)
    const user = await User.findById("61111dbbcaed1572881e545a");
    console.log(user.recipients);

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
