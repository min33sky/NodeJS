var express = require('express');
var app = express();
var bodyParser = require('body-Parser');

app.listen('3000', function () {
	console.log('실습 1 서버 연결 ');
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.send(`<a href='http://localhost:3000/main'>메인 페이지 이동</a>`)
})

app.get('/main', function (req, res) {
	res.sendFile(__dirname + '/public/main.html');
})

app.post('/search', function (req, res) {
	var word = req.body.search;
	res.render('result.ejs', {'result': word} )
})

app.post('/ajax', function (req, res) {
	var data = req.body.search;
	console.log(data);
	var result = {'result':'ok', 'search':data};
	res.json(result);
})
