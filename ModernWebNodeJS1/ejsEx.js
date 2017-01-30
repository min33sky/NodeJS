const ejs = require('ejs');
const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
	fs.readFile('ejsPage.ejs', 'utf8', (error, file)=>{
		// ejs 모듈을 활용합니다.
		const output = ejs.render(file, {
			name: '최순실 개썅년'
		});

		response.writeHead(200, {
			'Content-Type' : 'text/html'
		})
		response.end(output);
	});
}).listen(52273);

