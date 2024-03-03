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
        return "UserName Invalid";
    }
    else if (!passwordFlag) {
        return "Password Invalid";
    }
    else if (usernameFlag && passwordFlag) {
        await mongoose.connect(URI);
        const loginUser = await User.findOne({ userName: username });
            if (!loginUser) {
            try {
                const hash = await bcrypt.hash(password, saltRounds);
                const user = await User.create({ userName: username, password: hash });

                return "User created";
            } catch (error) {
                return error;
            }
        } else{
            return "UserName Already Taken..";
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
        return err;
    }
}

module.exports = {
    createUser,
    validateUserLogin
};
