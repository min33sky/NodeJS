var express = require('express')
var app = express()
var session = require('express-session')
// 암호화
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var FileStore = require('session-file-store')(session);

var bodyParser = require('body-parser');	
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: '1!24fdasf@##@asf!!@',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

app.listen(3003, function () {
	console.log('Connected 3003 PORT !!!');
});

// route
app.get('/count', function (req, res) {
	if(req.session.count){
		req.session.count++;
	}else{
		req.session.count = 1;
	}
	res.send('count : ' + req.session.count);
})

app.get('/tmp', function (req, res) {
	res.send('result : ' + req.session.count);
})

app.get('/auth/login', function (req, res) {
	var output = `
		<h1>Login</h1>
		<form action='/auth/login' method='post'>
			<p>
				<input type='text' name='username' placeholder='username'
			</p>
			<p>
				<input type='password' name='password' placeholder='password'
			</p>
			<p>
				<input type='submit'>
			</p>

		</form>
	`;
	res.send(output);
})

app.get('/welcome', function (req, res) {
	if(req.session.displayName){
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href="/auth/logout">Logout</a>

		`);
	} else {
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li>
					<a href="/auth/login">Login</a>
				</li>
				<li>
					<a href="/auth/register">Register</a>
				</li>
			</ul>
		`);
	}
})

app.get('/auth/register', function (req, res) {
	var output = `
		<h1>Register</h1>
		<form action='/auth/register' method='post'>
			<p>
				<input type='text' name='username' placeholder='username'
			</p>
			<p>
				<input type='password' name='password' placeholder='password'
			</p>
			<p>
				<input type='text' name='displayName' placeholder='displayName'
			</p>
			<p>
				<input type='submit'>
			</p>

		</form>
	`;
	res.send(output);
})

app.post('/auth/register', function (req, res) {
	hasher({password:req.body.password}, function(err, pass, salt, hash){
		var user = {
			username:req.body.username,
			password:hash,
			salt:salt,
			displayName:req.body.displayName
		};
		users.push(user);
		req.session.displayName = req.body.displayName;
		req.session.save(function(){
			res.redirect('/welcome');
		})
	});
})

 var users = [
    {
      username:'egoing',
	    password:'ULpfQmgAyKY3+sc5BlEtbeyRGWP1hkKI7WXx6UMu+xPnDkHK6TRv0dG0h8meSzJyeWI6/4YgKxYzPPTeEX6ZIpL8uDWrDbC6HQnyL6duO9f2WXAyhGv90x+e4OuCJME2AOUhdvZ/K/2cnJCKY2ObMCFEOSqf6fJ37d0WDld9B0o=',
 	    salt:'4ejPaOJXoZjJlSWDZZXe3Jt12ObWyDB8yucpuu1w3XXS0nSuMu+bGqCj97etpqfW9kuCNwV1Ttmp71KwJ2SwXQ==',
      displayName:'Egoing'
   }
  ];

// 로그인 
app.post('/auth/login', function (req, res) {

	var uname = req.body.username;
	var pwd = req.body.password;
	for(var i=0; i<users.length; i++){
		var user = users[i];
		if(uname === user.username){
			return hasher({password:pwd, salt:user.salt}, function(err,pass,salt,hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;
					req.session.save(function(){
						res.redirect('/welcome');
					})
				} else {
						res.send('Who are you? <a href="/auth/login">login</a>');
				}
			});
		}
		// if(uname === user.username && sha256(pwd+user.salt) === user.password){
		// 	req.session.displayName = user.displayName;
		// 	// 세션 세팅이 완전히 끝냈을때 redirect 한다.
		// 	// return을 해야 콜백함수를 즉시 정지시킬 수 있다.
		// 	return req.session.save(function(){
		// 		res.redirect('/welcome');
		// 	})
		
	}
})

app.get('/auth/logout', function (req, res) {
	delete req.session.displayName;
	res.redirect('/welcome');
})