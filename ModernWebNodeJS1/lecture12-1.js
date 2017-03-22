const request = require('request');
const cheerio = require('cheerio');

// 요청합니다.
request({
	 url : 'http://www.hanbit.co.kr/store/books/new_book_list.html',
	 headers : 
	 					{'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36' }
	}, (error, response, body) => {
	if(error) return;
	if(response.statusCode != 200) return;

	// 정상적으로 처리가 완료
	const $ = cheerio.load(body);
	// 분석합니다.
	const array = [];
	$('.sub_book_list').each(function () {
		const title = $(this).find('.book_tit').text();
		const writer = $(this).find('.book_writer').text();

		array.push({
			title: title.trim(),
			writer: writer.split(',').map((item) => item.trim())
		})

		console.log(array);
	})
})