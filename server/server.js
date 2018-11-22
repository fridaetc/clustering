const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const clustering = require('./clustering');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('sanitize').middleware);

const port = process.env.PORT || 5000;

checkToken = function(req, res, cb) {
  const token = req.headerString('authorization');
  if(token) {
    auth.isLoggedIn(token, function(decodedToken) {
      if(decodedToken) {
        cb(decodedToken.id);
      } else {
        res.status(403).send({data: null, message: "Wrong token"});
      }
    });
  } else {
    res.status(403).send({data: null, message: "No token provided"});
  }
}

app.get('/user', (req, res) => {
  checkToken(req, res, function(userId) {
    if(userId) {
      auth.getUser(userId, function(user) {
        res.status(200).send({data: user});
      });
    }
  });
});

app.post('/login', (req, res) => {
  let username = req.bodyString('username');
  let pw = req.bodyString('pw');

  if(username && pw) {
    auth.login(username, pw, function(userObj) {
      if(userObj) {
        res.status(200).send({
          message: "Logged in!",
          data: userObj
        });

      } else {
        res.status(200).send({data: null, message: "Wrong username and/or password"});
      }
    });

  } else {
    res.status(200).send({data: null, message: "No username and/or password provided"});
  }
});


app.get('/list', (req, res) => {
  checkToken(req, res, function(userId) {
    if(userId) {
      //do stuff
      console.log("DOOOO");
      clustering.cluster(function(data) {
        res.status(200).send({data});
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
