const saltRounds = 10;
const port = 3000;
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const URI = require('./db/databaseConfig');
mongoose.connect(URI);

const corsOptions = {
  origin: '*'
};

app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.send('login');
});
 
app.post('/submit-login', async (req, res) => {
  let responseData = '';
  
  const action = req.body.action;
  const username = req.body.username;
  const password = req.body.password;

  if(action == 'Register'){
      try {
          const responseData = await loginPage.createUser(username, password);
          res.send({page: "login", resopnseData: responseData});
      } catch (error) {
          console.error(error); 
          res.status(500);
      }
  }else if(action == 'Login'){
      try {
          const responseData = await loginPage.validateUserLogin(username, password);
          res.send({page: "homePage", resopnsedata: responseData});
      } catch (error) {
          console.error(error + responseData); 
          res.status(500);
      }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
