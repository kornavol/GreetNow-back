const texts = require("../model/texts");
const mongoose = require("mongoose");

const events = require("../model/events");
const categories = require("../model/categories");

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
    texts.findOne({ text: "with category and events" })
        .populate('events')
        .populate('categories')
        .exec((err, doc) => {
            console.log(err, doc)
            if (err) {
                res.send({ status: "failed", message: err });
            } else {

                const respond = JSON.parse(JSON.stringify(doc));

                 /* convert 'events' for fromn */
                const refArrConverter = (type) => {
                    
                    const newArr = respond[type].map(
                        (event) => (event = event.name)
                    );
                    
                    respond.type = newArr;
                
                    
                }
                
                refArrConverter('events')
                refArrConverter('categories')
                

                res.send({
                    status: "success",
                    message: "All data fetched successfuly",
                    data: respond,
                });
            }
        });
};











exports.saveText = (req, res) => {
    events.findOne({ name: "Christmas" }).exec((err, event) => {
        if (err) {
            res.send({ status: "failed", message: err });
        } else {
            const text = new texts({
                _id: new mongoose.Types.ObjectId(),
                text: "test7",
                events: [event._id],
            });
            text.save(function (err, text) {
                if (err) return handleError(err);
                res.send({
                    status: "success",
                    message: "All data fetched successfuly",
                    data: text,
                });
            });
        }
    });
};
