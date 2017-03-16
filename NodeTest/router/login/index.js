var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');	// 상대 주소 사용
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1234',
	database : 'studydb'
});
connection.connect();


router.get('/', function (req, res) {
	var msg;
	var errMsg = req.flash('error');	// 에러 메세지 전송
	if(errMsg) msg = errMsg;
	res.render('login.ejs', {'message': msg});
})

// 세션에 id값을 저장한다.(전달된 객체를 user로 받는다.)
passport.serializeUser(function (user, done) {
	console.log('passport session save : ' , user.id);
	done(null, user.id);
})

// 모든 페이지 요청이 있을 시 세션에 저장된 값을 뽑아온다.
passport.deserializeUser(function (id, done) {
	console.log('passport session get id : ' , id);
	var query = connection.query('SELECT * FROM user WHERE uid = ?', [id], function (err, rows) {
		console.log(rows[0]);
		// done(null, id);	  // ID 값만 전달
		done(null, rows[0]);	// 회원 정보를 전달
	})
})

// 로컬 로그인 전략
passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true  // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
}, function (req, email, password, done) {
	var query = connection.query('SELECT * FROM user WHERE email=? AND pw=?', [email,password], function (err, rows) {
		if(err) throw err;

		if(rows.length){	
			return done(null, {'email':email, 'id':rows[0].uid});
		} else {					
				return done(null, false, {'message' : 'Your login info is not found....'});
		}
	})
}))

// 로컬 로그인(JSON)
router.post('/', function (req, res, next) {
	passport.authenticate('local-login', function (err, user, info) {
		if(err) res.status(500).json(err);
		if(!user){
			return res.status(401).json(info.message);
		}

		req.logIn(user, function (err) {
			if(err){
				return next(err);
			}
			return res.json(user);
		});

	})(req, res, next);
});

module.exports = router;