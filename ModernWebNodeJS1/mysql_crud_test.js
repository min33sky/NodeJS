const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// db
var client = mysql.createConnection({
	user:'root',
	password:'1234',
	database:'company'
})
// express
const app = express();
// 소스보기 정렬
app.locals.pretty = true;
// Log
app.use(morgan('combined'));
// Post method body  
app.use(bodyParser.urlencoded({
	extended: false
}));

// Template 
app.set('views', './views');
app.set('view engine', 'jade');

// Routing
app.get('/', function(req, res){
		// db query
		var query = 'SELECT * FROM products';
		client.query(query, function(error, results){
			// 응답
			// console.log(results);
			res.render('./list', {data:results});
		});
})
app.get('/delete/:id', function(req, res){
	//query
	var query = 'DELETE FROM products WHERE id = ?';
	client.query(query, [req.params.id], function(err, results){
		res.redirect('/');
	})
})

app.get('/insert', function(req, res){
	res.render('./insert');
})

app.post('/insert', function(req, res){
	var body = req.body;
	console.log(body);

	var query = 'INSERT INTO products(name, modelnumber, series) Values (?,?,?)';
	client.query(query, [body.name, body.modelnumber, body.series], function(err, results){
		res.redirect('/');
	})
})

app.get('/edit/:id', function(req, res){
	// var id = req.params.id;
	var query = 'SELECT * FROM products WHERE id = ?';
	client.query(query, [req.params.id], function(error, results){
		// 1 Row를 받아오지만 배열로 받아오기 때문에 results[0]을 사용
		res.render('./edit', {data: results[0]});
	});
})
app.post('/edit/:id', function(req, res){
	let body = req.body;
	var qq = 'UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?';
	client.query(qq, [body.name, body.modelnumber, body.series, req.params.id], function(error, results){
		res.redirect('/');
	})
})

app.listen(52273, function(){
	console.log('Server Running......');
})