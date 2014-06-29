#!/usr/local/bin/node
var mongoose = require('mongoose');
var prompt = require('prompt');
mongoose.connect('mongodb://localhost/timer');

if(process.argv.length < 4) {
	console.log('Use: ./timer.js <company> <project>');
	process.exit(1);
}

var Entry = mongoose.model('Entry', 
{ 
	starttime: Number, 
	endtime: Number, 
	commit: String, 
	project: String, 
	company: String
});

var createEntry = function(c)  {
	var start = new Date().getTime(); //get the starting timestamp
	console.log('Starting timer', new Date());
	prompt.start();
	prompt.get(['commit'], function(err, res){

		if(!res || err)
			process.exit();
		var end = new Date().getTime();
		var entry = new Entry({
			starttime: start, 
			endtime: end, 
			commit: res.commit,
			company: process.argv[2],
			project: process.argv[3]
		});
		entry.save(function(err){
			if(err) {
				console.err(err);
			}
			else {
				console.log('Entry saved');
				setTimeout(createEntry, 1);
			}
		});
	});
}; 

createEntry();
