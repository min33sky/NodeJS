module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  var app = express();
  // code alignment in browser
  app.locals.pretty = true;
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
      host:'localhost',
      port:3306,
      user:'root',
      password:'1234',
      database:'android'
    })
  }));

  // Template 
  app.set('views', './views/mysql');
  app.set('view engine', 'jade');



  return app;
}