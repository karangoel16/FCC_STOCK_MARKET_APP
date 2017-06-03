var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stockSchema = new Schema({
	stock:{
		type:String,
		unique:true
	}
});

module.exports = mongoose.model('Stock',stockSchema);