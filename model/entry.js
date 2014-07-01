var mongoose = require('mongoose');
exports.module = mongoose.model('Entry', { 
		starttime: Number, 
		endtime: Number, 
		commit: String, 
		project: String, 
		company: String
	});
