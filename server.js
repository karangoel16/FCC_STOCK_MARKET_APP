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
var mongoStore = require('connect-mongo')(session);
require('dotenv').load();
require('./auth/passport')(passport);
app.use('/public', express.static(process.cwd() + '/public'));

var user_id={};
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
	socket.on('init',(val)=>{
		if(val===null){
			return;
		}
		if(user_id[val.id]==undefined){
			user_id[val.id]=new Array();
		}
		user_id[val.id].push(socket.id);
		User.findOne({_id:val.id},function(err,user){
			if(err){
				console.log(err);
				return ;
			}
			if(user)
			{
				socket.emit('initialize',{stock:user.stock});
			}
		});
	});
	socket.on('add',(stock)=>{
		console.log(stock);
		console.log('user has asked to add stock');
		User.update({_id:stock.id},{$addToSet:{'stock':stock.data}},function(err,user){
			if(err){
				console.log(err);
				return ;
			}
		});
		//var data="https://www.quandl.com/api/v3/datasets/WIKI/"+stock+".json?api_key="+process.env.API_KEY;
		axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stock.data + '.json?api_key='+process.env.API_KEY).then( (response) => {
			user_id[stock.id].forEach(function(user_val){
				console.log(user_val);
				if(io.sockets.connected[user_val]){
					io.sockets.connected[user_val].emit('stock-added',{name:stock.data,data:response.data.dataset});
				}
				else{
					var val=user_id[stock.id].indexOf(user_val);
					if(val!=-1)
					{
						user_id[stock.id].splice(val,1);
					}
					console.log("remove value");
				}
			});
			//socket.emit('stock-added',{name:stock.data,data:response.data.dataset});	
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

