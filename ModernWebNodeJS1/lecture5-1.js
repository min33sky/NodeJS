// 모듈 추출
const http = require('http');
const fs = require('fs');
const url = require('url');

// 서버 생성
const server = http.createServer((request, response) => {

	/*
		Cookie Setting
	*/
	const date = new Date();
	date.setDate(date.getDate() + 7);

	// path 
	const pathname = url.parse(request.url).pathname;


	if(pathname == '/a'){
		fs.readFile('korea.jpg', (error, file) => {
			// 응답 헤더 작성
			response.writeHead(200, {
				'Content-type' : 'image/jpeg',
				'Set-Cookie' : [
						'breakfast=toast; Expires = ' + date.toUTCString(),
						'dinner=chicken'
				]
			})
			// 응답 본문 작성
			response.end(file);
		});

	}else if(pathname == '/b'){
		fs.readFile('song.mp3',  (error, file) => {
			response.writeHead(200, {
				'Content-type' : 'audio/mp3'
			})
			response.end(file);
		});
	}else if(pathname == '/c'){
		fs.readFile('HTMLPage.html', (error, data) => {
			response.writeHead(200, {
				'Content-type' : 'text/html'
			});
			response.end(data);
		});
	}else{
		response.writeHead(404);
		response.end()
	}
});

// 서버 실행
server.listen(52273, () => {
	console.log('Server Running at http://127.0.0.1:52273');
});


