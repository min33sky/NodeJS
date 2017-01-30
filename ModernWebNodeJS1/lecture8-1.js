const express = require('express');
const app = express();
const mysql = require('mysql');

// 데이터베이스와 연결
var client = mysql.createConnection({
	user:'root',
	password:'1234',
	database:'company'
});

// 데이터베이스 쿼리 사용

// client.query('INSERT INTO products(name, modelnumber, series) VALUES (?,?,?)', 
//               ['siba', '0123456789', 'Soccer Line'], function(err, results, fields){
// 	if(err){
// 		console.log('query error!!');
// 	} else {
// 		console.log(results);
// 	}
// })

client.query('SELECT * FROM products', function(err, results, fields){
	if(err){
		console.log('query Error!!');
	} else{
		console.log(results);
	}
})