module.exports = function(mongoose){
	return mongoose.model('Entry', { 
		starttime: Number, 
		endtime: Number, 
		commit: String, 
		project: String, 
		company: String
	});
};
