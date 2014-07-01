#!/usr/local/bin/node
var 	MongoClient = require('mongodb').MongoClient, 
	format = require('util').format,  
	moment = require('moment'), 
	prompt = require('prompt'),
	config = require('./config'), 
	fs = require('fs'), 
	request = require('request');

if(process.argv.length >= 3) {
	var company  = process.argv[2];
	var project = process.argv[3];
}
else {
	console.log('usage: ./basecamp.js <company> <project>');
	process.exit(1);
}

if(process.argv.length >= 4)
	if(process.argv[4] == 'save')
		var save = process.argv[4];

//Prompt schema
var schema = {
	properties: {
		password: {
			message: 'password for ' + config.basecampUsername,
			hidden: true
		}
	}
};

// Start the prompt
prompt.start();

// Get two properties from the user: email, password
prompt.get(schema, function (err, input) { 

	if(err) throw err;

	MongoClient.connect(config.mongo, function(err, db) {
		if(err) throw err;

		db.collection('entries').find({company: company, project: project, fetched: null, uploaded: null})
			.toArray(function(e, res){
			if(!e) {

				for(var i = 0; i < res.length; i++) {
					(function(){
						var id = res[i]['_id'];
						var minutes= ((Math.round((res[i].endtime - res[i].starttime) / 1000 / 60 * 100))/100)
						var decimalHours = minutes / 60;
						
						//Create an xml object to send:
						var data = "<time-entry><person-id>" + config.basecampUserid + "</person-id><date>" + moment(res[i].starttime).toISOString() + "</date><hours>" + decimalHours  + "</hours><description>" + res[i].commit + "</description></time-entry>";

						//Send it. Note this is an async request 
						request({url: config.basecamp[project], body: data, method: 'POST', headers: { "Content-type": 'application/xml'}}, function(err, res, body){
							if(err)
								throw err;

							console.log('Entry id: ', id, 'Decimal hours:', decimalHours, '/ Minutes: ', minutes);
							console.log(body);
						}).auth(config.basecampUsername, input.password);
					})();
				}
				
				//if requested to save, it'll mark the entries as 'saved' to prevent them coming up again
				if(save) {
					db.collection('entries').update(
						{company: company, fetched: null}, 
						{$set: {uploaded: true}}, 
						{multi: true},
						function(e){
							console.error(e);
							db.close();
						});
					}
				else {
					db.close();
				}
			}

		});

	});


});




