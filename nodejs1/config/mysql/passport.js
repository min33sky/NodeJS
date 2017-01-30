module.exports = function(app){
	var conn = require('./db')();	// db 가져오기
	var bkfd2Password = require("pbkdf2-password");
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;
	var hasher = bkfd2Password();

	// passport
	app.use(passport.initialize());
	app.use(passport.session());


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
	
	return passport;
}
