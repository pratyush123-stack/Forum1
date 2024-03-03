const mongoose = require('mongoose');

const userLoginDetails = new mongoose.Schema({
    uID: String,
    userName: String,
    password: String
});

module.exports = mongoose.model("userLoginDetails", userLoginDetails);
