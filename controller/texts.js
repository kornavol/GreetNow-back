const texts = require("../model/texts");
const mongoose = require("mongoose");

const events = require("../model/events");
const categories = require("../model/categories");





exports.getAll = async (req, res) => {

    let isFiltred = true

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    /* ! Why it can be declareted over const  */
    let numberOfDocuments = await texts.countDocuments().exec()

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    let pages = {
        limit
    }
    
    /* ! need to change logic for filtring */
    pages.totalpages  = numberOfDocuments / limit

    /* checking if prev and next pages are consist. 
    If yes, make a recording to respond */
    if (startIndex > 0) {
        pages.previos = page - 1
    }
    
    if (endIndex < numberOfDocuments) {
        pages.next = page + 1
    }
    
    
    let abc = texts.find({events: {_id : "60e6e118bd1a790fa83201d8"}})
    
    if (!isFiltred) {
        abc = texts.find()  
    }
    
    abc
        // .populate('events', null, {name: 'Christmas'})
        .populate('events')
        .populate('categories')
        .limit(limit)
        .skip(startIndex)
        .exec((err, docs) => {
            if (err) {
                res.status(500).send({ status: "failed", message: err });
            } else {
                const respond = JSON.parse(JSON.stringify(docs));

                /* convert 'events' for fromn */
                const refArrConverter = (type) => {
                    respond.forEach(element => {
                        const newArr = element[type].map(
                            (event) => (event = event.name)
                        );
                        element[type] = newArr;
                    });
                }

                refArrConverter('events')
                refArrConverter('categories')

                res.send({
                    status: "success",
                    message: "All data fetched successfuly",
                    data: { pages: pages, texts: respond },
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
