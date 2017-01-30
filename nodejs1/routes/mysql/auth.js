module.exports = function(passport){
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../../config/mysql/db')();
  var route = require('express').Router();

  /*
    ROUTE
  */

  // Logout
  route.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      res.redirect('/topic');
    });
  });


  // Local Login
  route.post(
    '/login',
    /*
       Local Authentication Middleware 실행
       : 콜백함수를 만들어서 리턴하는 역할
       'local' -> passport.use(new LocalStrategy(...))의 콜백함수 실행
    */
    passport.authenticate(
      'local',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );

  // Facebook Login
  // Facebook Authentication Middleware Callback
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {scope:'email'}
    )
  );

  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login'
      }
    )
  );

  /*
    Local Member Register
  */
  route.post('/register', function(req, res){
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
  route.get('/register', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function (err, topics, fields){
      res.render('auth/register', {topics: topics});
    });
  });

  // Login Form
  route.get('/login', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function (err, topics, fields){
      res.render('auth/login', {topics: topics});
      
    });
  });

  return route;
};