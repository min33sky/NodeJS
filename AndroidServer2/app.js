var app = require('./config/mysql/express')();
var auth = require('./routes/mysql/auth')();
var notice = require('./routes/mysql/notice')();
app.use('/auth/', auth);			// 로그인
app.use('/notice/', notice);	// 공지사항


app.listen(3003, function(){
  console.log('Connected, 3003 port! : Android Registeration Server');
})