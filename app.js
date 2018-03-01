// app.js
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var db = require('./db');

//create express app
var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //access static files in ‘public’ folder
app.use(session({secret:'sessionTesting', resave: false, saveUninitialized: false
}));

app.use('/', routes);
//app.use('/users', UserController); we gonna use the / path cause warmup2 dont wanna use "/users"

module.exports = app;

/*
git add .; git commit -m "commit"; git push
sudo rm -rf warmupProject2; sudo git clone https://github.com/samn334/warmupProject2; cd warmupProject2; sudo nodemon ./server.js
*/