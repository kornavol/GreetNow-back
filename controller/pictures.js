const multer = require("multer");
const path = require("path");

const pictures = require("../model/pictures");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "greeting-pictures");
    },
    filename: function (req, file, cb) {
        cb(null, path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage }).single("file");


exports.getAll = (req, res) => {
    console.log("get all pictures");

    pictures.find()
        .populate('events')
        .populate('categories')
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
                    data: respond,
                });
            }
        });
};

