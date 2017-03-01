module.exports = function(){
  var conn = require('../../config/mysql/db')();
  var route = require('express').Router();

  // 과목 리스트
  route.get('/list', function (req, res) {
    console.log("******과목 출력***********");
    var courseUniversity = req.query.courseUniversity;
    var courseYear = req.query.courseYear;
    var courseTerm = req.query.courseTerm;
    var courseArea = req.query.courseArea;
    var courseMajor = req.query.courseMajor;
    console.log(courseUniversity);
    console.log(courseYear);
    console.log(courseTerm);
    console.log(courseArea);
    console.log(courseMajor);
  	var sql = 'SELECT * FROM course WHERE courseUniversity = ? AND courseYear = ? AND courseArea = ? AND courseMajor = ?';
  	conn.query(sql, [courseUniversity, courseYear, courseArea, courseMajor], function (err, results) {
      var jsonObj = JSON.parse(JSON.stringify(results));
      console.log(jsonObj);
      if(jsonObj.length == 0){
        var result = {"response" : []};
        res.set('Content-Type', 'application/json' );
        res.send(result);
      }else{
        var result = {"response" : jsonObj};
        res.set('Content-Type', 'application/json');
        res.send(result);
      }
  	});
  });

  // 수강 신청
  route.post('/add', function (req, res) {
    var query = "INSERT INTO schedule VALUES (?, ?)";
    conn.query(query, [req.body.userID, req.body.courseID], function (err, results) {
      if(err){
        console.log('수강 과목 삽입 에러');
        var result = {"response" : {"success" : false}};
        res.set('Content-Type', 'application/json');
        res.send(result);
      }else{
        var result = {"response" : {"success" : true}};
        res.set('Content-Type', 'application/json');
        res.send(result);
      }
    })
  })

  // 수강 목록 가져오기
  route.get('/selectOne', function (req, res) {
    var query = 'SELECT course.courseID, course.courseTime, course.courseProfessor FROM user, schedule, course WHERE user.userID = ? AND user.userID = schedule.userID AND schedule.courseID = course.courseID';
    conn.query(query, [req.query.userID], function (err, results) {
      var obj = JSON.parse(JSON.stringify(results));
      var result = {'response' : obj};
      console.log(result);
      res.set('Content-Type', 'application/json');
      res.send(result);
    })
  })

  return route;
}