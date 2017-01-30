const onUncaughtExcepton = (error) => {
	console.log('예외가 발생했군 ^_^ 이번에만 봐주겠다 ^_^ ..!');
	// 이벤트 제거
	process.removeListener('uncaughtException', uncaughtException);
}

process.on('uncaughtException', onUncaughtExcepton)
// 대체 : process.once('uncaughtException', onUncaughtExcepton)


// 2초 간격으로 예뢰를 발생시킵니다.
let count = 0;
const test = () => {
	setTimeout(test, 2000);
	error.error.error();
}
setTimeout(test, 2000);