// 모듈 추출
const http = require('http');
const fs = require('fs');

// 서버 생성
const server = http.createServer((request, response) => {
	if(request.url == '/a'){
		fs.readFile('korea.jpg', (error, file) => {
			response.writeHead(200, {
				'Content-type' : 'image/jpeg',
				'Set-Cookie' : [
						'breakfast=toast',
						'dinner=chicken'
				]
			})
			response.end(file);
		});
	}else if(request.url == '/b'){
		/*
			리다에렉트할 때 주로 302 상태코드를 사용한다.
		*/
		response.writeHead(302, {
			'Location' : 'http://www.naver.com'
		})
		response.end();
	}else{
		response.writeHead(404);
		response.end()
	}
});

// 서버 실행
server.listen(52273, () => {
	console.log('Server Running at http://127.0.0.1:52273');
});


