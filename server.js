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
var User = require('./model/user');
var Stock = require('./model/stock');
var mongoStore = require('connect-mongo')(session);
require('dotenv').load();
require('./auth/passport')(passport);
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url:process.env.MONGO_URI,
		autoRemove:'native'
	})
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, '/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

routes(app,passport);

var io = require('socket.io').listen(server);
io.on('connection',function(socket){
	console.log("A user connected")
	socket.on('init',()=>{
		Stock.find({},function(err,stock){
			if(err){
				console.log(err);
				return ;
			}
			console.log(stock);
			function reduce(val){
				return val.stock;
			}
			if(stock)
			{
				socket.emit('initialize',{stock:[stock.map(reduce)]});
			}
		});
	});
	socket.on('add',(stock)=>{
		console.log(stock);
		console.log('user has asked to add stock');
		//var data="https://www.quandl.com/api/v3/datasets/WIKI/"+stock+".json?api_key="+process.env.API_KEY;
		axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock.data + '.json?api_key='+process.env.API_KEY).then( function(response){
				socket.emit('stock-added',{name:stock.data,data:response.data.dataset});
				var STOCK=new Stock();
				STOCK.stock=stock.data;
				STOCK.save(function(err){
				if(err){
					if(err.code===11000)
					{
						//console.log(err.code);
						socket.emit('stock-added',{name:stock.data,data:response.data.dataset});
					}
					return;
				}
				else
				{
					console.log("succesffully added");
				}
				});
				if(stock.status)
				{
					socket.broadcast.emit('stock-added',{name:stock.data,data:response.data.dataset});
				}
			}).catch(function(err){
				if(stock!==null)
					socket.emit('err');
			});
			//socket.emit('stock-added',{name:stock.data,data:response.data.dataset});	
			//socket.broadcast.emit('stock-added',{name:stock,data:response.data.dataset.data});	
			//socket.broadcast.emit('stock-added',response.data);	
		});
	socket.on('delete',(stock)=>{
		console.log('user has asked to delete the stock');
		//we will delete value from here
		socket.emit('delete-stock',stock.data);
		socket.broadcast.emit('delete-stock',stock.data);
			console.log("removed");
	});
	socket.on('disconnect',()=>{

		console.log("User disconnected");
		//socket.reconnect();

	});
});



server.listen(port);

