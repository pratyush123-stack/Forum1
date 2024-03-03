const constants = require('./constants/Constants');
const saltRounds = 10;
const port = 3000;
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const loginPage = require('./js/login')

const URI = require('./db/databaseConfig');
mongoose.connect(URI);

const corsOptions = {
  origin: '*'
};

app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, emailId, phoneNo, dateOfBirth, gender } = req.body;
  console.log("Received registration request:", req.body);
  try {
    const responseData = await loginPage.createUser(username, password, firstName, lastName, emailId, phoneNo, dateOfBirth, gender);
    res.json({ page: constants.PAGE_HOME, responseData });
    console.log("Registration successful:", responseData);
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({ error: constants.ERROR_INTERNAL_SERVER });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request:", req.body);
  try {
    const responseData = await loginPage.validateUserLogin(username, password);
    res.json({ page: constants.PAGE_LOGIN, responseData });
    console.log("Login successful:", responseData);
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ error: constants.ERROR_INTERNAL_SERVER });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
