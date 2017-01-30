// 모듈 추출
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// 서버 실행
const app = express();

// request 이벤트 리스너 설정
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/files', express.static(`${__dirname}/public`));

app.get('/a/:page', (req, res) => {
	res.send(`<h1>${req.params.page}페이지입니다.</h1>`);
})
// 서버 실행
app.listen(52273, function(){
	console.log('Server Running at http:127.0.0.1:52273');
})