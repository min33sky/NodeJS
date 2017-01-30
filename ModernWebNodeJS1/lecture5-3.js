var http = require('http')
var url = require('url')

http.createServer((request, response) => {
	// url.parse => string을 url객체로 변환
	var query = url.parse(request.url, true).query;

	response.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	// query를 json형식으로 치환해서 출력
	response.end('<h1>' + JSON.stringify(query) + '</h1>');
}).listen(52273);