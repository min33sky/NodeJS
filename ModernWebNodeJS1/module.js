exports.a = 10;

// 절대값을 구하는 메서드
module.exports.abs = function(number){
	if(number > 0){
		return number;
	}else{
		return -number;
	}
}

// 원의 넓이를 구하는 메서드
module.exports.circleArea = function(radius){
	return radius * radius * Math.PI;
}
