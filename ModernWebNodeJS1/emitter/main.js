const tick = require('./tick')

// tick 이벤트 발생시 호출
tick.on('tick', on => {
	console.log('test');
})