var app = require('./config/mysql/express')();
var auth = require('./routes/mysql/auth')();
app.use('/auth/', auth);


app.listen(3003, function(){
  console.log('Connected, 3003 port! : Android WebServer');
})