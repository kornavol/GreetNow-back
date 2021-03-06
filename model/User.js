//to validate email - regular expression javascript: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const cards = require("./cards");

// const autoCardsShema = new mongoose.Schema({
//     event:String
// })

const recipientShema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    relationships: Array,
    events: Array,
    newCards: Number,
    autoCards:Array
    // autoCards:{event:String}
    // autoCards: {autoCardsShema},
},
{
    timestamps: true
})

const cardShema = new mongoose.Schema({
    text: String,
    picture: String,
    recipient: String,
    event:String,
    createdBy: String
}, 
{
    timestamps: true
})

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    recipients: [recipientShema],
    cards:[cardShema]
},
    {
        timestamps: true
    });

//this checks if the password is not modified it will not rehashed
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

//compare password if you are logging in
UserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;