const texts = require("../model/texts");
const mongoose = require("mongoose");


const events = require("../model/events");

// exports.getAll = (req, res) => {
//     texts.find({}, (err, docs) => {
//       if (err) {
//         res.send({ status: "failed", message: err });
//       } else {
//         res.send({ status: "success", message: "All data fetched successfuly", data: docs });
//         console.log(docs)
//       }
//     });
//   };

exports.getAll = (req, res) => {
    texts.findOne({ text: "test7" }).
        exec((err, docs) => {
            if (err) {
                res.send({ status: "failed", message: err });
            } else {
                res.send({ status: "success", message: "All data fetched successfuly", data: docs });
            }
        });
};

exports.saveText = (req, res) => {
    events.findOne({ name: "Christmas" }).
        exec((err, event) => {
            if (err) {
                res.send({ status: "failed", message: err });
            } else {

                const text = new texts({
                    _id: new mongoose.Types.ObjectId(),
                    text: 'test7',
                    events: [event.name]
                })
                text.save(function (err, text) {
                    if (err) return handleError(err);
                    res.send({ status: "success", message: "All data fetched successfuly", data: text });
                });
            }
        });
};
