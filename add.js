var prompt = require('prompt'), 
	mongoose = require('mongoose'),
	async = require('async'),
	keypress = require('keypress-prompt'),
	str = require('date-util');

mongoose.connect('mongodb://localhost/timer');

var Entry = require('./models/entry')(mongoose);

if(process.argv.length < 3) {
	console.log('Usage: ./add.js <company> <project>');
	process.exit(1);
}

var addEntry = function(){

	var entry; //create a variable exterior to the waterfall scope to save passing it through all those callbacks

	async.waterfall([
		function(cb){
			console.log('Specify start time and decimal hours');
			prompt.start();
			prompt.get(['start', 'hours', 'commit'], cb);
			
		},
		function(res, cb) {
			var start = res.start * 1000; //Create a javascript timestamp  
			var end = start + (res.hours * 60 * 60 * 1000);
			console.log('Start: ', new Date(start));
			console.log('End: ', new Date(end));
			console.log('Message: ', res.commit);

			entry = new Entry({ //set the entry
				starttime: start, 
				endtime: end, 
				commit: res.commit,
				company: process.argv[2],
				project: process.argv[3]
			});

			setTimeout(cb(null, res), 0);
		},
		function(res, cb) {
			console.log('is this ok? (y/n)');
			prompt.get(['yn'], cb);
		},
		function(res, cb){
			if(res.yn == 'y') {
				entry.save(function(err){
					if(err) {
						console.err(err);
					}
					else {
						console.log('Entry saved');
						setTimeout(addEntry(), 1);
					}
				});
			}
			else {
				console.log('Entry not saved');
				addEntry();
			}
		},
	], function(err, res){
		console.error('Error', err, res);
	});
};

addEntry();
