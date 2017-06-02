var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var routes = require('./routes/index.js');
var app = express();
var port = process.env.PORT || 8080;

var path = require('path');
var engine = require('ejs-locals');
require('dotenv').load();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.set('views', path.join(__dirname, '/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

routes(app);

var server=app.listen(port);
var io = require('socket.io').listen(server);

io.on('connection',function(socket){
	//console.log("A user connected");
	socket.on('disconnect',()=>{
		console.log("User disconnected");
	});
});



