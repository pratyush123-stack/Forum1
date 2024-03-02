const mongoose = require('mongoose');

const userDataTable = new mongoose.Schema({
    userName: String,
    password: String,
    registionDTL: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userDataTable);
