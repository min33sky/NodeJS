module.exports = function(){
  var conn = require('../../config/mysql/db')();
  var route = require('express').Router();

  // 공지사항 리스트
  route.get('/list', function (req, res) {
  	var sql = 'SELECT * FROM notice ORDER BY noticeDate DESC';
  	conn.query(sql, function (err, results) {
  		var arr = JSON.parse(JSON.stringify(results));
  		var result = {'response' : arr};
  		console.log(result);
  		res.set('Content-Type', 'application/json');
  		res.send(result);
  	});
  });

  return route;
}