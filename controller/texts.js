const mongoose = require("mongoose");

const texts = require("../model/texts");

const events = require("../model/events");

exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const eventId = req.query.event;
  const categoryId = req.query.category;
  const isFiltred = req.query.isFiltred;

  /* ! Why it can be declareted over const  */
  let numOfDocs = await texts.countDocuments().exec();
  /* Compute aditional information */
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let pages = {
    limit,
  };

  /* Interdependence between query and input data
      Don't like this structure. Needs review
    */

  let find;

  if (eventId && categoryId) {
    const pass = { events: { _id: eventId }, categories: { _id: categoryId } };
    find = texts.find(pass);
    numOfDocs = await texts.countDocuments(pass).exec();
    // console.log('both');
  } else if (eventId && !categoryId) {
    const pass = { events: { _id: eventId } };
    find = texts.find(pass);
    numOfDocs = await texts.countDocuments(pass).exec();
    // console.log('event');
    // console.log(eventId)
  } else if (!eventId && categoryId) {
    // console.log("category");
    // console.log(categoryId)
    const pass = { categories: { _id: categoryId } };
    find = texts.find(pass);
    numOfDocs = await texts.countDocuments(pass).exec();
  }

  if (!isFiltred) {
    find = texts.find();
  }

  /* checking if prev and next pages are consist.
    If yes, make a recording to respond */
  if (startIndex > 0) {
    pages.previos = page - 1;
  }

  if (endIndex < numOfDocs) {
    pages.next = page + 1;
  }

  /* ! need to change logic for filtring */
  /* Math.ceil will always round up to the next highest integer */
  pages.totalPages = Math.ceil(numOfDocs / limit);
  pages.totalDocs = numOfDocs;

  find
    .populate("events")
    .populate("categories")
    .limit(limit)
    .skip(startIndex)
    .exec((err, docs) => {
      if (err) {
        res.status(500).send({ status: "failed", message: err });
      } else {
        /* converting 'ref' obj  to symple array */
        const respond = JSON.parse(JSON.stringify(docs));

        const refArrConverter = (type) => {
          respond.forEach((element) => {
            const newArr = element[type].map((event) => (event = event.name));
            element[type] = newArr;
          });
        };

        refArrConverter("events");
        refArrConverter("categories");

        res.send({
          status: "success",
          message: "All data fetched successfuly",
          data: { pages: pages, texts: respond },
        });
      }
    });
};

/* this function does'n use. Here only as example */
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
