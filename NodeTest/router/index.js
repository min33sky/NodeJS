var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');	// 상대 주소 사용
var main = require('./main/main');
var email = require('./email/email');
var join = require('./join/index');
var login = require('./login/index');
var logout = require('./logout/index');
var movie = require('./movie/index');

router.get('/', function (req, res) {
	// sendFile(절대 주소를 사용) : __dirname (전역변수)
	console.log('indexjs / path loaded');
	res.sendFile(path.join(__dirname, '../public/main.html'));
})

// 라우팅
router.use('/main', main);
router.use('/email', email);
router.use('/join', join);
router.use('/login', login);
router.use('/logout', logout);
router.use('/movie', movie);

module.exports = router;