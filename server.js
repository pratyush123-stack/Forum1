const saltRounds = 10;
const port = 3000;

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const loginPage = require('./js/login');
const URI = require('./db/databaseConfig');
mongoose.connect(URI);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'loginPage')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginPage', 'login.html'));
});

app.post('/submit-login', async (req, res) => {
  const action = req.body.action;
  const username = req.body.username;
  const password = req.body.password;

  if(action == 'Register'){
    try {
      const responseData = await loginPage.createUser(username, password);
      res.sendFile(path.join(__dirname, 'loginPage', 'login.html'), {responseData});
    } catch (error) {
      console.error(error); 
      res.status(500);
    }
  }else if(action == 'Login'){
    try {
      const responseData = await loginPage.validateUserLogin(username, password);
      res.sendFile(path.join(__dirname, 'pages', 'homePage.html'), {responseData});
    } catch (error) {
      console.error(error + responseData); 
      res.status(500);
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
