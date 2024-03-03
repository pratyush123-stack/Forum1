function validateUserName(data){
    const regex = /^[a-zA-Z0-9\s#@_.]+$/;
    return regex.test(data);
}

function validateNames(data){
    const regex = /^[a-zA-Z]+$/;
    return regex.test(data);
}

function validatePassword(password) {
    if (password.length < 6) {
        return false;
    }
    return true;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhoneNo(phoneNo) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNo);
}

function validateDateOfBirth(dateOfBirth) {
    const isValidDate = !isNaN(Date.parse(dateOfBirth));
    if (!isValidDate) {
        return false;
    }
    const inputDate = new Date(dateOfBirth);
    const currentDate = new Date();
    if (inputDate > currentDate) {
        return false;
    }
    return true;
}

function validateGender(gender) {
    const lowercaseGender = gender.toLowerCase();
    return lowercaseGender === "male" || lowercaseGender === "female";
}

module.exports = {
    validateUserName,
    validatePassword,
    validateNames,
    validateEmail,
    validatePhoneNo,
    validateDateOfBirth,
    validateGender
  };