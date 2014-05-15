#!/usr/local/bin/node
var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;

if(process.argv.length >= 2)
	var company  = process.argv[2];

MongoClient.connect('mongodb://127.0.0.1:27017/timer', function(err, db) {
	if(err) throw err;

	db.collection('entries').find({company: company, fetched: null})
		.toArray(function(e, res){
		if(!e) {

			var amount = 0;
			for(var i = 0; i < res.length; i++) {
				amount += (res[i].endtime - res[i].starttime);
			}

			console.log('Total hours for '+ company, (Math.round(amount / 1000 / 60 / 60 * 10 ) / 10));
		}

		db.close();


	});

});

