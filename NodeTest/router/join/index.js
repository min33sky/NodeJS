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
	res.render('join.ejs', {'message': msg});
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

// 로컬 조인할때의 전략
passport.use('local-join', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
}, function (req, email, password, done) {
	var query = connection.query('SELECT * FROM user WHERE email=?', [email], function (err, rows) {
		if(err) throw err;

		if(rows.length){	// 존재하는 Email일 때
			console.log('existed user');
			return done(null, false, {message : 'your email is already used'});
		} else {					// 가입이 가능한 Email일 때
			console.log('email' , email);
			console.log('name', req.body.name);
			console.log('password' , password);
			var sql = {email: email, name: req.body.name, pw: password };
			var query = connection.query('INSERT INTO user SET ?', sql, function (err, rows) {
				if(err) throw err;
				/*
					 done()의 매개변수에 false가 아닌 객체값을 넣었을 때 이 객체를 세션에 저장하는
					 함수가 실행된다. 그 함수는 passport.serializeUser() 이다.
				*/
				return done(null, {'email' : email, 'name' : req.body.name, 'id' : rows.insertId});
			})
		}
	})
}))

// 로컬 조인
router.post('/', passport.authenticate('local-join', {
			successRedirect: '/main',
			failureRedirect: '/join',
			failureFlash: true})
);


// router.post('/', function (req, res) {
// 	var body = req.body;
// 	var email = body.email;
// 	var name = body.name;
// 	var passwd = body.password;

// 	var query = connection.query('INSERT INTO user(email, name, pw) VALUES(?,?,?)', [email, name, passwd], function (err, rows) {
// 		if(err) throw err;
// 		console.log('OK DB INSERT : ', rows.insertId, name);
// 		res.render('welcome.ejs', {'name':name, 'id':rows.insertId});
// 	})
// })


module.exports = router;