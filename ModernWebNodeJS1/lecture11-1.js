// Socket.Io 연습
const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

// 객체 선언
const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);
// 미들웨어 설정
app.use(express.static('public'));
// 웹 소켓을 설정
io.sockets.on('connection', (socket) => {
	// 변수를 선언
	let roomName = null;
	console.log(socket);

	// 클라이언트를 방에 배정합니다.
	socket.on('joinABCD', (data)=>{
		roomName = data.roomName;
		socket.join(data.roomName);
	})

	// 클라이언트에서 데이터가 전달되면, 배분합니다.
	socket.on('message', (data)=>{
		io.sockets.in(roomName).emit('message', {
			message: 'From Server'
		})
	})
});

// 서버 실행
server.listen(52273, ()=>{
	console.log('Server Running at http://127.0.0.1:52273');
});
