var http = require('http')
var fs = require('fs')
var querystring = require('querystring')

http.createServer((request, response)=>{
	if(request.method == 'GET'){
		fs.readFile('HTMLPage2.html', (error, data) =>{
			response.writeHead(200, {
				'Content-Type' : 'text/html'
			});
			response.end(data);
		});
	}else if(request.method == 'POST'){
		request.on('data', (data) => {
			response.writeHead(200, {
				'Content-Type' : 'text/html'
			});

			/*
				querystring을 이용하여 query 문자열 분해
			*/
			var query = querystring.parse(data.toString());
			console.log('data_a: ' + query.data_a);
			console.log('data_b: ' + query.data_b);

			response.end(`
				<h1>${data}</h1>
				<h1>${query.data_a}</h1>
				<h1>${query.data_b}</h1>
				`);
		})
	}
}).listen(52273);