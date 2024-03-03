
function validateUserName(data){
    const regex = /^[a-zA-Z0-9\s#@_.]+$/;
    return regex.test(data);
}

function validatePassword(password) {
    if (password.length < 6) {
        return false;
    }
    return true;
}

module.exports = {
    validateUserName,
    validatePassword
  };