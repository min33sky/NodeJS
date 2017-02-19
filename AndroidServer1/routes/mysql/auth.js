module.exports = function(){
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

  /*
    Local Member Register
  */
  route.post('/register', function(req, res){
    hasher({userPassword:req.body.userPassword}, function(err, pass, salt, hash){
      var user = {
        userID:req.body.userID,
        username:req.body.userName,
        userPassword:req.body.userPassword,
        userAge:req.body.userAge,
        // userPassword:hash,
        // salt:salt,
      };
      var sql = 'INSERT INTO user SET ?';
      conn.query(sql, user, function(err, results){
        /*
           안드로이드 앱에 JSON 형식으로 응답을 해준다.
        */
        if(err){
          console.log(err);
          var jsonStr = JSON.stringify({'success' : false});
          res.set('Content-Type', 'application/json');
          res.send(jsonStr);

        } else {
          console.log(user);
          var jsonStr = JSON.stringify({'success' : true});
          res.set('Content-Type', 'application/json');
          res.send(jsonStr);
        }
      });
    });
  });

  // Login 
  route.post('/login', function(req, res){
    var sql = 'SELECT * FROM user WHERE userID = ? AND userPassword = ?';
    conn.query(sql, [req.body.userID, req.body.userPassword ],function (err, results){
      // 로그인 기능을 위해서 RowDataPacket을 활용한다.
      var result = JSON.parse(JSON.stringify(results));
      // 아무것도 반환되지 않을 시 로그인 실패
      if(result.length == 0){
        var jsonStr = JSON.stringify({'success' : false});
        res.set('Content-Type', 'application/json');
        res.send(jsonStr);
      } else {
        var jsonStr = JSON.stringify({
          'success' : true,
          'userID' : req.body.userID,
          'userPassword' : req.body.userPassword
        });
        res.set('Content-Type', 'application/json');
        res.send(jsonStr);
      }    
    });
  });

  // 회원 List 출력
  route.get('/list', function (req, res) {
    var sql = 'SELECT * FROM user';
    conn.query(sql, function (err, results) {
      var result = {"response" : JSON.parse(JSON.stringify(results))};
      console.log(result);
      res.set('Content-type', 'application/json');
      res.send(result);
    })
  })

  // 회원 삭제
  route.post('/delete', function (req, res) {
    var sql = 'DELETE FROM user WHERE userID = ?';
    conn.query(sql, [req.body.userID], function (err, results) {
      console.log('삭제 아이디 : ' + req.body.userID);
      if(err){
        var result = JSON.stringify({"success" : false});
        res.set('Content-Type', 'application/json');
        res.send(result);
      }else{
        var result = JSON.stringify({"success" : true});
        res.set('Content-Type', 'application/json');
        res.send(result);
      }
    })
  })

  return route;
};