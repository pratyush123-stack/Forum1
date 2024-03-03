const constants = require('../constants/Constants');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const URI = require('../db/databaseConfig');
const saltRounds = 10;
const userDetails = require('../models/UserDetails');
const userLoginDetails = require('../models/UserLoginDetails');
const validations = require('../utils/validations');

function generateID() {
    const characters = constants.ID_GENERATION_CHARACTERS;
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

async function createUser(username, password, firstName, lastName, emailId, phoneNo, dateOfBirth, gender) {
    console.log("Received request to create user with username:", username);

    const usernameFlag = validations.validateUserName(username);
    const passwordFlag = validations.validatePassword(password);
    const firstNameFlag = validations.validateNames(firstName);
    const lastNameFlag = validations.validateNames(lastName);
    const emailIdFlag = validations.validateEmail(emailId);
    const phoneNoFlag = validations.validatePhoneNo(phoneNo);
    const dateOfBirthFlag = validations.validateDateOfBirth(dateOfBirth);
    const genderFlag = validations.validateGender(gender);

    if (!usernameFlag) {
        console.log(constants.USERNAME_INVALID);
        return constants.USERNAME_INVALID;
    } else if (!passwordFlag) {
        console.log(constants.PASSWORD_INVALID);
        return constants.PASSWORD_INVALID;
    } else if (!firstNameFlag) {
        console.log(constants.FIRST_NAME_INVALID);
        return constants.FIRST_NAME_INVALID;
    } else if (!lastNameFlag) {
        console.log(constants.LAST_NAME_INVALID);
        return constants.LAST_NAME_INVALID;
    } else if (!emailIdFlag) {
        console.log(constants.EMAIL_ID_INVALID);
        return constants.EMAIL_ID_INVALID;
    } else if (!phoneNoFlag) {
        console.log(constants.PHONE_NUMBER_INVALID);
        return constants.PHONE_NUMBER_INVALID;
    } else if (!dateOfBirthFlag) {
        console.log(constants.DATE_OF_BIRTH_INVALID);
        return constants.DATE_OF_BIRTH_INVALID;
    } else if (!genderFlag) {
        console.log(constants.GENDER_INVALID);
        return constants.GENDER_INVALID;
    }

    console.log("All input parameters are valid");

    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");
        const existingUser = await userLoginDetails.findOne({ userName: username });
        if (existingUser) {
            console.log(constants.USER_NAME_ALREADY_TAKEN);
            return constants.USER_NAME_ALREADY_TAKEN;
        }
        const uID = generateID();
        console.log("Generated unique user ID:", uID);

        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Password hashed successfully");

        await userDetails.create({ 
            firstName: firstName, 
            lastName: lastName,
            emailId: emailId,
            phoneNo: phoneNo,
            dateOfBirth: dateOfBirth,
            gender: gender,
            userName: username,
            password: hash,
            uID: uID,
        });
        console.log("UserDetails created successfully");

        await userLoginDetails.create({ 
            uID: uID, 
            userName: username, 
            password: hash 
        });
        console.log("UserLoginDetails created successfully");

        return constants.USER_CREATED_SUCCESSFULLY;
    } catch (error) {
        console.error("Error occurred:", error);
        return constants.ERROR_OCCURRED;
    }
}



async function validateUserLogin(userName, password) {
    console.log("Received request to validate user login with userName:", userName);
    const usernameFlag = validations.validateUserName(userName);
    const passwordFlag = validations.validatePassword(password);

    if (!usernameFlag) {
        console.log(constants.USERNAME_INVALID);
        return constants.USERNAME_INVALID;
    } else if (!passwordFlag) {
        console.log(constants.PASSWORD_INVALID);
        return constants.PASSWORD_INVALID;
    }
    console.log("Username and password are valid");

    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");

        const loginUser = await userLoginDetails.findOne({ userName: userName });
        if (!loginUser) {
            console.log(constants.USER_NOT_FOUND);
            return constants.USER_NOT_FOUND;
        } else {
            console.log("User found in database");
            const passwordMatchFlag = await bcrypt.compare(password, loginUser.password);
            if (passwordMatchFlag) {
                console.log(constants.PASSWORD_MATCHED_SUCCESSFULLY);
                console.log(constants.LOGGED_IN_SUCCESSFULLY);
                return constants.LOGGED_IN_SUCCESSFULLY;
            } else {
                console.log(constants.PASSWORD_DID_NOT_MATCH);
                return constants.PASSWORD_DID_NOT_MATCH;
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return constants.ERROR_OCCURRED;
    }
}


module.exports = {
    createUser,
    validateUserLogin,
    generateID
};
