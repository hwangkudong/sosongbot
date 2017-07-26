var mongoose = require('mongoose');
var Schema = mongoose;

//스키마 정의
var messageSchema = mongoose.Schema({
		menu_nm : String,
		content : String,
		button  : String,
		isnew   : Boolean
	
});

module.exports = mongoose.model('message', messageSchema);
