#!/usr/local/bin/node
var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;

if(process.argv.length >= 2)
	var company  = process.argv[2];

if(process.argv.length >= 3)
	if(process.argv[3] == 'save')
		var save = process.argv[3];

	
MongoClient.connect('mongodb://127.0.0.1:27017/timer', function(err, db) {
	if(err) throw err;

	db.collection('entries').find({company: company, fetched: null})
		.toArray(function(e, res){
		if(!e) {

			for(var i = 0 ; i < res.length; i++){
				console.log('insert into assignment_timesheets(assignment_id, start_date_time, end_date_time, comment, assigned_to) values(');
				console.log('-1, ' + (res[i].starttime / 1000 ) + ', ' + (res[i].endtime / 1000) + ', "' + res[i].commit + '", 1);');
			}


		}

		if(save) {
			db.collection('entries').update(
				{company: company, fetched: null}, 
				{$set: {fetched: true}}, 
				{multi: true},
				function(e){
					console.error(e);
					db.close();
				});
			}
		else {
			db.close();
		}


	});

});

