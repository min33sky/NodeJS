var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');	// 상대 주소 사용
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// DATABASE SETTING
var connection = require('../../config/mysql/index')();

router.get('/list', function (req, res) {
	res.render('movie.ejs');
})

// 1. /movie, GET (영화 전체 목록 가져오기)
router.get('/', function (req, res) {
	var responseData = {};

	var query = connection.query('SELECT title FROM movie', function (err, rows) {
		console.log(rows);
		if(err) throw err;
		if(rows.length){
			responseData.result = 1;
			responseData.data = rows;
		}else{
			responseData.result = 0;
		}
		res.json(responseData);	// JSON 형식으로 응답
		})
})

// 2. /movie, POST (영화 추가)
router.post('/', function (req, res) {
	var title = req.body.title;
	var type = req.body.type;
	var grade = req.body.grade;
	var actor = req.body.actor;

	var sql = {title, type, grade, actor};
	var query = connection.query('INSERT INTO movie SET ?', sql, function (err, rows) {
		console.log(rows);
		if(err) throw err;
		return res.json({'result' : 1});
	})
})

// 3. /movie/:title, GET
router.get('/:title', function (req, res) {
	var title = req.params.title;
	console.log('title => ' , title);

	var responseData = {};

	var query = connection.query('SELECT * FROM movie WHERE title=?', [title], function (err, rows) {
		if(err) throw err;
		if(rows[0]){
			responseData.result = 1;
			responseData.data = rows;
		}else{
			responseData.result = 0;
		}
		res.json(responseData);
	})
})

// 4. /movie/:title, DELETE
router.delete('/:title', function (req, res) {
	var title = req.params.title;

	var responseData = {};

	var query = connection.query('DELETE FROM movie WHERE title = ?', [title], function (err, rows) {
		if(err) throw err;
		console.log('Row is ---->' , rows);
		if(rows.affectedRows > 0){		// 삭제한 값이 있다.
			responseData.result = 1;
			responseData.data = title;	// 영화 제목을 Return. 
		} else {											// 삭제할 데이터가 없다.
			responseData.result = 0;
		}

		res.json(responseData);
	})
})

// 5. /movie/:title, PUT (영화 업데이트)
router.put('/:title', function (req, res) {
	var title = req.body.title;
	var type = req.body.type;
	var grade = req.body.grade;
	var actor = req.body.actor;

	console.log('수정.....');
	console.log(title);
	console.log(type);
	console.log(grade);
	console.log(actor);


	var query = connection.query('UPDATE movie SET type=?, grade=?, actor=? WHERE title = ?', [type, grade, actor, title] , function (err, rows) {
		console.log(rows);
		if(err) throw err;
		if(rows.affectedRows > 0){
			return res.json({'result' : 1});
		}else{
			return res.json({'result' : 0});			
		}
	})

})


module.exports = router;