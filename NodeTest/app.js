var express = require('express');
var app = express();
// POST 메소드 모듈
var bodyParser = require('body-parser');
var router = require('./router/index');
// 로그인 관련 모듈
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');	// Passport의 message 처리 도와주는 모듈

// 서버 가동
app.listen(3000, function () {
	console.log("start! express server on port 3000");
});

// public 디렉토리에 static 파일(js, image, css)을 저장
app.use(express.static('public'));
// post로 메세지 주고 받을 수 있다
app.use(bodyParser.json());
// 한글이나 특수문자는 인코딩해서 전송된다
app.use(bodyParser.urlencoded({extended:true}));
// ejs 템플릿 엔진 사용
app.set('view engine', 'ejs');

// 가입 & 로그인 & 세션관리
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 라우터 
app.use(router);



