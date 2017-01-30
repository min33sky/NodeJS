process.on('exit', (code) => {
	console.log('안녕히 가거라^_^....');
	console.log(code);
})		

console.log('실행중입니다.');


/*
	 exit code 
	 0 : 안전 / 정상종료
	 1 : 비정상 종료
*/

process.on('uncaughtException', (error) => {
	console.log('예외가 발생했군 ^_^ 봐주겠다 ^_^..!');
})

// 에러를 강제로 발생시킨다 : uncaughtException -> exit 이벤트 발생
error.error.error();