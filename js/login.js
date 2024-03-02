const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const URI = require('../db/databaseConfig');
const saltRounds = 10;
const User = require('../models/UserDataTable');
const validations = require('../utils/validations');

async function createUser(username, password) {
    const usernameFlag = validations.validateUserName(username);
    const passwordFlag = validations.validatePassword(password);
    if (!usernameFlag) {
        console.log('UserName Invalid');
    }
    else if (!passwordFlag) {
        console.log('Password Invalid');
    }
    else if (usernameFlag && passwordFlag) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            const user = await User.create({ userName: username, password: hash });

            console.log('User created:', user);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

async function validateUserLogin(userName, password) {
    const usernameFlag = validations.validateUserName(userName);
    const passwordFlag = validations.validatePassword(password);
    if (!usernameFlag) {
        return "UserName Invalid";
    }
    if (!passwordFlag) {
        return "Password Invalid";
        
    }
    try {
        await mongoose.connect(URI);
        const loginUser = await User.findOne({ userName: userName });
        if (!loginUser) {
            return "User not found";
        }
        const passwordMatchFlag = await bcrypt.compare(password, loginUser.password);
        if (passwordMatchFlag) {
            return "Password matched successfully";
        } else {
            return "Password did not match";
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

module.exports = {
    createUser,
    validateUserLogin
};
