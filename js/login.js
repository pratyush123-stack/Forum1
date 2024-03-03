const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const URI = require('../db/databaseConfig');
const saltRounds = 10;
const userDetails = require('../models/UserDetails');
const userLoginDetails = require('../models/UserLoginDetails');
const validations = require('../utils/validations');

function generateID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
        console.log("Username is invalid");
        return "UserName Invalid";
    } else if (!passwordFlag) {
        console.log("Password is invalid");
        return "Password Invalid";
    } else if (!firstNameFlag) {
        console.log("First name is invalid");
        return "First Name Invalid";
    } else if (!lastNameFlag) {
        console.log("Last name is invalid");
        return "Last Name Invalid";
    } else if (!emailIdFlag) {
        console.log("Email ID is invalid");
        return "Email ID Invalid";
    } else if (!phoneNoFlag) {
        console.log("Phone number is invalid");
        return "Phone Number Invalid";
    } else if (!dateOfBirthFlag) {
        console.log("Date of birth is invalid");
        return "Date of Birth Invalid";
    } else if (!genderFlag) {
        console.log("Gender is invalid");
        return "Gender Invalid";
    }

    console.log("All input parameters are valid");

    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");
        const existingUser = await userLoginDetails.findOne({ userName: username });
        if (existingUser) {
            console.log("User with username", username, "already exists");
            return "UserName Already Taken";
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

        return "User Created Successfully";
    } catch (error) {
        console.error("Error occurred:", error);
        return "Error occurred while creating user";
    }
}



async function validateUserLogin(userName, password) {
    console.log("Received request to validate user login with userName:", userName);
    const usernameFlag = validations.validateUserName(userName);
    const passwordFlag = validations.validatePassword(password);

    if (!usernameFlag) {
        console.log("Username is invalid");
        return "UserName Invalid";
    } else if (!passwordFlag) {
        console.log("Password is invalid");
        return "Password Invalid";
    }
    console.log("Username and password are valid");

    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");

        const loginUser = await userLoginDetails.findOne({ userName: userName });
        if (!loginUser) {
            console.log("User not found");
            return "User not found";
        } else {
            console.log("User found in database");
            const passwordMatchFlag = await bcrypt.compare(password, loginUser.password);
            if (passwordMatchFlag) {
                console.log("Password matched successfully");
                console.log("Logged in Successfully");
                return "Logged in Successfully";
            } else {
                console.log("Password did not match");
                return "Password did not match";
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return "Error occurred while validating user login";
    }
}


module.exports = {
    createUser,
    validateUserLogin,
    generateID
};
