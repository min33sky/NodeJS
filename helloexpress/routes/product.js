var express = require('express');
var router = express.Router();
var client = require('../config/db')();

/* GET users listing. */
// router.get('/', function (req, res) {
//   res.render('product', {title: 'Product Page'});
// })

//
// Routing
router.get('/', function(req, res){
		// db query
		var query = 'SELECT * FROM products';
		client.query(query, function(error, results){
			// 응답
			// console.log(results);
			res.render('product/list', {data:results});
		});
})
router.get('/delete/:id', function(req, res){
	//query
	var query = 'DELETE FROM products WHERE id = ?';
	client.query(query, [req.params.id], function(err, results){
		res.redirect('/product');
	})
})

router.get('/insert', function(req, res){
	res.render('product/insert');
})

router.post('/insert', function(req, res){
	var body = req.body;
	console.log(body);

	var query = 'INSERT INTO products(name, modelnumber, series) Values (?,?,?)';
	client.query(query, [body.name, body.modelnumber, body.series], function(err, results){
		res.redirect('/product');
	})
})

router.get('/edit/:id', function(req, res){
	// var id = req.params.id;
	var query = 'SELECT * FROM products WHERE id = ?';
	client.query(query, [req.params.id], function(error, results){
		// 1 Row를 받아오지만 배열로 받아오기 때문에 results[0]을 사용
		res.render('product/edit', {data: results[0]});
	});
})
router.post('/edit/:id', function(req, res){
	let body = req.body;
	var qq = 'UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?';
	client.query(qq, [body.name, body.modelnumber, body.series, req.params.id], function(error, results){
		res.redirect('/product');
	})
})
module.exports = router;
