var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');	// 상대 주소 사용

// Main page는 Login이 될 때만(즉 세션정보가 있을땜나 접근이 가능하게 하자.)
router.get('/', function (req, res) {
	// 세션 값을 req.user로 받는다.
	console.log('Session 값  : ', req.user);

	if(req.user){							// 로그인, 회원가입 성공 시
		var id = req.user.uid;
		var email = req.user.email;
		var name = req.user.name;
		res.render('main.ejs', {'id' : id, 'email' : email, 'name' : name});

	}else{										// 비로그인은 로그인창으로 리다이렉트
		res.render('login.ejs');
	}

});

module.exports = router;
