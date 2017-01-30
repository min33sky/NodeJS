// EventEmitter 클래스를 가져온다.
const EventEmitter = require('events');

// 이미터를 생성한다.
const customEmitter = new EventEmitter();

customEmitter.on('tick', ()=>{
	console.log('tick 이벤트가 발생했습니다.');
})

customEmitter.emit('tick')
customEmitter.emit('tick')
customEmitter.emit('tick')
customEmitter.emit('tick')