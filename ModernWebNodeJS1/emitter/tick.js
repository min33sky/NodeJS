// EventEmitter 클래스를 가져온다.
const EventEmitter = require('events');

// 이미터를 생성한다.
const customEmitter = new EventEmitter();

// 0.5초마다 콜백함수 실행
setInterval(()=>{
	// tick 이벤트를 발생시킨다.
	customEmitter.emit('tick')
}, 500);


module.exports = customEmitter;