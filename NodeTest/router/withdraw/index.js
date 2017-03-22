var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var passport = require('passport');

// DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1234',
	database : 'studydb'
});
connection.connect();


// 회원 탈퇴
router.get('/', function (req, res) {
	var email = req.user.email;		// 세션에서 email 값을 가져온다.
	var query = connection.query('DELETE FROM user WHERE email = ?', [email], function (err, rows) {
		console.log(rows);
		if(err) 
			throw err;
		req.logout();								// 세션값 삭제를 위해서 넣어준다.
		res.redirect('/main');			
	})

})

module.exports = router;