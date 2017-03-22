/*
	MYSQL DB
*/
module.exports = function () {
	var mysql = require('mysql');

	// DATABASE SETTING
	var connection = mysql.createConnection({
		host : 'localhost',
		port : 3306,
		user : 'root',
		password : '1234',
		database : 'studydb'
	});

	connection.connect();

	return connection;
}