const pictures = require("../model/pictures");

exports.getAll = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const eventId = req.query.event;
    const categoryId = req.query.category;
    const isFiltred = req.query.isFiltred;

    /* ! Why it can be declareted over const  */
    let numOfDocs = await pictures.countDocuments().exec();;

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
        find = pictures.find(pass);
        numOfDocs = await pictures.countDocuments(pass).exec();
        // console.log('both');
    } else if (eventId && !categoryId) {
        const pass = { events: { _id: eventId } };
        find = pictures.find(pass);
        numOfDocs = await pictures.countDocuments(pass).exec();
        // console.log('event');
    } else if (!eventId && categoryId) {
        const pass = { categories: { _id: categoryId } };
        find = pictures.find(pass);
        numOfDocs = await pictures.countDocuments(pass).exec();
        // console.log("category");
    }

    if (!isFiltred) {
        find = pictures.find();
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
    pages.totalPages =  Math.ceil(numOfDocs / limit)
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
                    data: { pages: pages, pictures: respond },
                });
            }
        });
};