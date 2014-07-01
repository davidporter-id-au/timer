var prompt = require('prompt'), 
	yesno = require('yesno'),
	str = require('date-util');

if(process.argv.length < 3) {
	console.log('Usage: ./add.js <company> <project>');
	process.exit(1)
}

console.log('Specify start time and decimal hours');
prompt.start();
prompt.get(['start', 'hours'], function(err, res){
	if(err)	 {
		throw err;
	}

	var start = new Date().strtotime(res.start) * 1000; //Create a javascript timestamp  
	var end = start + (res.hours * 60 * 60 * 1000);

	console.log('Adding entry for ', process.argv[2], process.argv[3]);
	console.log('Start: ', new Date(start));
	console.log('End: ', new Date(end));
	yesno.ask('is this ok? ', true, function(ok){
			
	});

});
