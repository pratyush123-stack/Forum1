
function validateUserName(data){
    const regex = /^[a-zA-Z0-9\s#@_.]+$/;
    return regex.test(data);
}

function validatePassword(data) {
    const regex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@#_]+$/;
    return regex.test(data);
}

module.exports = {
    validateUserName,
    validatePassword
  };