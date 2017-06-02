var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var routes = require('./routes/index.js');
var axios = require('axios');
var passport = require('passport');
var app = express();
var server = require('http').createServer(app);
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

var io = require('socket.io').listen(server);

io.on('connection',function(socket){
	console.log("A user connected")

	socket.on('add',(stock)=>{
		console.log(stock);
		//socket.emit('stock-added');		
		//socket.emit('stock-added');
		console.log('user has asked to add stock');
		//var data="https://www.quandl.com/api/v3/datasets/WIKI/"+stock+".json?api_key="+process.env.API_KEY;
		axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock.data + '.json?api_key='+process.env.API_KEY).then( (response) => {
			socket.emit('stock-added',{name:stock,data:response.data.dataset});	
			//socket.broadcast.emit('stock-added',{name:stock,data:response.data.dataset.data});	
			//socket.broadcast.emit('stock-added',response.data);	
		});
	});

	socket.on('delete',(stock)=>{
		console.log('user has asked to delete the stock');
		socket.emit('delete-stock');
	});
	socket.on('disconnect',()=>{
		console.log("User disconnected");
		//socket.reconnect();

	});
});



server.listen(port);

