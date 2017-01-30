const express = require('express')
const bodyParser = require('body-parser')

const app = express();

app.listen(52273);

app.use(bodyParser.urlencoded({
	extended: false
}));

// 변수 선언
const users = {};

app.get('/user', (req, res) =>{
	res.send(users);
})
app.post('/user', (req, res) => {
	const body = req.body;
	// 예외 처리
	if(!body.id){
		return res.send('id를 보내주세요');
	}
	if(!body.name){
		return res.send('name를 보내주세요');
	}
	if(!body.region){
		return res.send('region를 보내주세요');
	}

	// 변수 추출
	let id = body.id;
	let name = body.name;
	let region = body.region;

	// 데이터를 저장
	users[id] = {
		name: name,
		region: region
	}
	// 응답
	res.send(users[id]);
})

app.get('/user/:id', (req, res) => {
	// 변수를 선언
	const id = req.params.id;
	res.send(users[id]);
})
app.put('/user/:id', (req, res) => {
	const id = req.params.id;
	if(req.body.name){
		users[id].name = req.body.name;
	}
	if(req.body.region){
		users[id].region = req.body.region;
	}
	res.send(users[id]);
})
app.delete('/user/:id', (req, res) =>{
	const id = req.params.id;
	delete users[id];
	res.send('제거!!');
})