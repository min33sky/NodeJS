var http = require('http')

http.createServer((request, response) => {
	// 쿠키가 있는지 확인
	if(request.headers.cookie){
		// 쿠키를 추출하고 분해
		var cookie = request.headers.cookie.split(';').map(function(element){
			var element = element.split('=');
			return {
				key : element[0],
				value : element[1]
			}
		});
		
		response.end('<h1>' + JSON.stringify(cookie) + '</h1>');
	} else {
		// 쿠키를 생성
		response.writeHead(200, {
			'Content-type' : 'text/html',
			'Set-Cookie' : ['name = sana', 'region = osaka']
		});

		response.end('<h1>쿠키를 생성했습니다.</h1>')
	}
}).listen(52273, function(){
	console.log('52273 Port Connect');
});