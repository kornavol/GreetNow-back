const jwt = require('jsonwebtoken');


exports.tokenDecription = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.query.userid = decoded.id
    next();

}