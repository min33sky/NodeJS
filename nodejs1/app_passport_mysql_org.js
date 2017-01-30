var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'o2'
});
conn.connect();

var app = express();

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
    database:'o2'
  })
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Template 
app.set('views', './views_passport');
app.set('view engine', 'jade');

/*
  ROUTE
*/
app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});

// Logout
app.get('/auth/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

/*
   Passport에서 Session 관리
   첫번째 매개변수 user는 done(null, user)의 두번째 매개변수이다.
*/
passport.serializeUser(function(user, done) {
  console.log('----------------------2--------------------\n');
  console.log('serializeUser', user);
  // Session에 user.authId가 저장된다.
  done(null, user.authId);
});

// 세션에 등록된 이용자가 사이트에 접근할때 자동 호출
// function(id, done)의 id는 
// passport.use(new LocalStrategy(...)의
// done(null, user.authId) 두번째 인자값
passport.deserializeUser(function(id, done) {
  console.log('----------------------3--------------------\n');
  console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], function(err, results){
    if(err){
      console.log(err);
      done('There is no user.');
    } else {
      done(null, results[0]);
    }
  });
});

/*
  Local Authentication Middleware
*/
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, ['local:'+uname], function(err, results){
      if(err){
        return done('There is no user.');
      }
      var user = results[0];
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy', user);
          // passport.serializeUser의 콜백함수가 실행된다.
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });
  }
));

/*
  Facebook Authentication Middleware
*/
passport.use(new FacebookStrategy({
    clientID: '229832104140539',
    clientSecret: '3c6a56ebca926f943c402ae090f09f8e',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('-----------------------1------------------\n');
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [authId], function(err, results){
      if(results.length>0){
        done(null, results[0]);
      } else {
        var newuser = {
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        };
        var sql = 'INSERT INTO users SET ?'
        conn.query(sql, newuser, function(err, results){
          if(err){
            console.log(err);
            done('Error');
          } else {
            done(null, newuser);
          }
        })
      }
    });
  }
));

// Local Login
app.post(
  '/auth/login',
  /*
     Local Authentication Middleware 실행
     : 콜백함수를 만들어서 리턴하는 역할
     'local' -> passport.use(new LocalStrategy(...))의 콜백함수 실행
  */
  passport.authenticate(
    'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
);

// Facebook Login
// Facebook Authentication Middleware Callback
app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook',
    {scope:'email'}
  )
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);

/*
  Local Member Register
*/
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:hash,
      email:req.body.email,
      salt:salt,
      displayName:req.body.displayName
    };
    var sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        // 등록과 동시에 로그인
        req.login(user, function(err){
          // 세션 작업 완료 후 리다이렉트
          req.session.save(function(){
            res.redirect('/welcome');
          });
        });
      }
    });
  });
});

// Register Form
app.get('/auth/register', function(req, res){
  res.render('register');
});

// Login Form
app.get('/auth/login', function(req, res){
  res.render('login');
});

app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});