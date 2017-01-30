var url = require('url')
var querystring = require('querystring')

var parsedObject = url.parse('https://search.naver.com/search.naver?where=nexearch&query=%EC%9E%A5%EA%B8%B0%EC%99%95&sm=top_lve&ie=utf8')
console.log(querystring.parse(parsedObject.query));