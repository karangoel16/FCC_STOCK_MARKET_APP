var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	email:{
		type:String,
		unique:true
	},
});

module.exports = mongoose.model('User',userSchema);