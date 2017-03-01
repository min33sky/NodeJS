var app = require('./config/mysql/express')();
var auth = require('./routes/mysql/auth')();
var notice = require('./routes/mysql/notice')();
var course = require('./routes/mysql/course')();
app.use('/auth/', auth);			// 로그인
app.use('/notice/', notice);	// 공지사항
app.use('/course/', course);	// 과목들


app.listen(3003, function(){
  console.log('Connected, 3003 port! : Android Registeration Server');
})