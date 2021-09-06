const crypto = require('crypto');
const User = require('../model/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
    //res.send('Register Route'); --> this was created at the beginning to test the server with postman
    //async was added after the test
    const {firstName, lastName, email, password} = req.body;

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        res.status(201).json({
            success: true
        });
        /* sendToken(user, 201, res); */
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    //res.send('Login Route');
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if(!user){
            //401 unauthorized
            return next(new ErrorResponse('Invalid credentials, username or password is not correct', 401));
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            //401 unauthorized
            return next(new ErrorResponse('Invalid credentials, username or password is not correct', 401));
        }

        sendToken(user, 200, res);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.forgotPassword = async (req, res, next) => {
    //res.send('Forgot Password Route');
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return next(new ErrorResponse('Email could not be sent', 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${process.env.FRONT_ROUTE}/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            })
            res.status(200).json({success: true, data: 'Email sent'});
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse('Email could not be send', 500));
        }

    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    //res.send('Reset Password Route');
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    //try to find the user that has the same token
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()} //mongoDB - $gt selects those documents where the value of the field is greater than
        })

        if(!user){
            return next(new ErrorResponse('Invalid reset token', 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password Reset Success'
        });
    } catch (error) {
        next(error);
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({message:'you are logged in', success: true, token})
}