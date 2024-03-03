const mongoose = require('mongoose');

const userDetails = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    phoneNo: String,
    dateOfBirth: Date,
    gender: String,
    userName: String,
    password: String,
    uID: String,
    registionDTL: { type: Date, default: Date.now },
})

module.exports = mongoose.model("userDetails", userDetails);
