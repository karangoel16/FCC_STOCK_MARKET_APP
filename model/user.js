var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	email:{
		type:String,
		unique:true
	},
	stock:{},
	socket_id:{}
});

module.exports = mongoose.model('User',userSchema);