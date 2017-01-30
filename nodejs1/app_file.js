var express = require('express');
var app = express();
// http method : post body 활용
var bodyParser = require('body-parser');	
var fs = require('fs');

/*
 file upload(multer)
 - https://github.com/expressjs/multer
*/
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage })

// code alignment in browser
app.locals.pretty = true;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
	console.log('Connected, 3000 port!!!');
});

/*
 	static middleware
  	/user/파일명으로 접근 가능
*/
app.use('/user', express.static('uploads'))

// Template 
app.set('views', './views_file');
app.set('view engine', 'jade');

/*
	Route 
*/

app.get('/upload', function (req, res) {
	res.render('upload');
})

app.post('/upload', upload.single('userfile'), function (req, res, next) {
	console.log(req.file);
	res.send('uploaded!' + req.file.filename);
})

app.get('/topic/new', function (req, res) {
	fs.readdir('data', function (err, files) {
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error')
		}
		res.render('new', {topics: files});
	});
})

app.post('/topic', function (req, res) {
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/'+title, description, function (err) {
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic/' + title)
	});
})

app.get(['/topic', '/topic/:id'], function (req, res) {
	// 디렉토리의 파일들 읽어오기
	fs.readdir('data', function (err, files) {
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}

		var id = req.params.id;
		
		if(id){
			// ID값이 있을 때
			fs.readFile('data/'+id, 'utf8', function (err, data) {
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error')
				}	
				res.render('view', {title: id, topics: files, description: data});
			});			
		}else{
			// ID값이 없을 때
			res.render('view', {topics: files, title:'Welcome', description: 'Hello, JavaScript for server'});
		}
	});
})
