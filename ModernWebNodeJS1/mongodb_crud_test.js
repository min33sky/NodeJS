const mongojs = require('mongojs');
// para1 : dababase name, para2 : collection(tabel)
const db = mongojs('node', ['products']);

// 전체 출력
db.products.find((err, results)=>{
	console.log(results);
});
// 1개만 출력(최상위 row)
db.products.findOne((err, results)=>{
	console.log(results);
});
// 오름차순 정렬 후 2개 건너뛰고 3개만 출력하기
db.products.find().sort({name:1}).skip(2).limit(3, (err, results) => {
	console.log(results);
});