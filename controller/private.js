const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.getPrivateData = async (req, res, next) => {

    let token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const username = user.username;

    res.status(200).json({
        success: true,
        data: `Hi ${username}!`
    });
}