const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const URI = require('../db/databaseConfig');
const saltRounds = 10;
const User = require('../models/UserDataTable');
const validations = require('../utils/validations');

async function createUser(username, password) {
    console.log(username, password);
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
                await User.create({ userName: username, password: hash });
                return "User Created Successfully";
            } catch (error) {
                return error;
            }
        } else{
            return "UserName Already Taken..";
        }
    }
}

async function validateUserLogin(userName, password) {
    console.log(username, password);
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
        }else{
            const passwordMatchFlag = await bcrypt.compare(password, loginUser.password);
            if (passwordMatchFlag) {
                return "Password matched successfully";
            } else {
                return "Password did not match";
            }
        }
    } catch (error) {
        return error;
    }
}

module.exports = {
    createUser,
    validateUserLogin
};
