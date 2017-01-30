/*
	정적인 파일은 웹서버를 다시 시작안해도 변경이 가능하지만
	동적인 파일들은 웹서버를 재시작해야 적용이 된다.
*/

var express = require('express');
var bodyParser = require('body-parser');

var app = express(); 
// 웹브라우져에서 소스보기할 때 코드 정렬하기
app.locals.pretty = true;

// POST로 전달받은 값들을 꺼내올 수 있다.
app.use(bodyParser.urlencoded({ extended: false }));

// views, 템플리트가 있는 디렉토리
app.set('views', './views');
// view engine, 사용할 템플리트 엔진
app.set('view engine', 'jade');


app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

// public 폴더에서 정적 파일을 서비스한다.
app.use(express.static('public'));


// get : router
// route : 길을 찾는다.
app.get('/', function (req, res) {
	res.render('index', {title: 'Hey', message: 'Hello there~!'});
});

app.get('/form', function (req, res) {
	res.render('form')
})

app.get('/form_receiver', function (req, res) {
	var title = req.query.title;
	var description = req.query.description;
	res.send(title + ', ' + description )
})

/*
	POST Method
*/
app.post('/form_receiver', function (req, res) {
	var title = req.body.title;
	var description = req.body.description;
	res.send(title + ', ' + description);
})

app.get('/route', function (req, res) {
	res.send('Hello Router, <img src="/sana.jpg">')
})

app.get('/dynamic', function (req, res) {
	var lis = '';
	for(var i=0; i<5; i++){
		lis = lis + '<li>coding</li>';
	}
	var time = new Date();
	// ` -> JavaScript 새로운 한줄 처리 문법
	// ${변수} : String에서 변수 사용하기http://www.afreecatv.com/?hash=all
	var output = `<!DOCTYPE html>
								<html lang="ko">
								<head>
									<meta charset="UTF-8">
									<title>Document</title>
								</head>
								<body>
									Hello, Dynamic!
									<ul>
										${lis}
									</ul>
										${time}
								</body>
								</html>`;
	res.send(output);
})

app.get('/template', function (req, res) {
	// template 사용해서 응답하기 
	res.render('temp', {time: Date(), _title: 'Jade'});
})

/*
	 Semantic Url
*/
app.get('/topic/:id', function (req, res) {
	var topics = [
		'Javascript is...',
		'Nodejs is...',
		'Express is...'
	];

	var output = `
		<a href="/topic/0">Javascript</a><br>
		<a href="/topic/1">Nodejs</a><br>
		<a href="/topic/2">Express</a><br>
		${topics[req.params.id]}
	`
	res.send(output);
})

app.get('/topic/:id/:mode', function (req, res) {
	res.send(req.params.id + ', ' + req.params.mode);
})