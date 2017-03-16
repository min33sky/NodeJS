var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');	// 상대 주소 사용
var mysql = require('mysql');

// DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1234',
	database : 'studydb'
});

connection.connect();


router.post('/form', function (req, res) {
	// get : req.param('email')
	console.log(req.body.email);
	// res.send('<h1>welcome ' + req.body.email + '</h1>')
	res.render('email.ejs', {'email':req.body.email});
})

router.post('/ajax', function (req, res) {
	var email = req.body.email;
	var responseData = {};

	var query = connection.query('SELECT name FROM user WHERE email = "'+email+'"', function (err, rows) {
		console.log(rows);
		if(err) throw err;
		if(rows[0]){
			responseData.result = 'ok';
			responseData.name = rows[0].name;
		}else{
			responseData.result = 'none';
			responseData.name = '';
		}
		res.json(responseData);	// JSON 형식으로 응답
	})
})

module.exports = router;