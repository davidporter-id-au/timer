#!/usr/local/bin/node
var MongoClient = require('mongodb').MongoClient
	, format = require('util').format;

var mustache = require('mustache');
var moment = require('moment');
var fs = require('fs');

if(process.argv.length >= 2)
	var company  = process.argv[2];

MongoClient.connect('mongodb://127.0.0.1:27017/timer', function(err, db) {
	if(err) throw err;

	db.collection('entries').find({company: company, fetched: null})
		.toArray(function(e, res){
		if(!e) {

			var amount = 0;
			for(var i = 0; i < res.length; i++) {
				res[i]['startString'] = moment(res[i].starttime).format('D/M/YY, h:mm a');;
				res[i]['hours'] = moment(res[i].endtime - res[i].starttime).minutes();
				amount += (res[i].endtime - res[i].starttime);
			}

			var totalHours = (Math.round(amount / 1000 / 60 / 60 * 10 ) / 10);
			var rate = 30;
			var invoiceTotal = rate * totalHours; 
			var today = moment().format('D/M/YY');

			//Pass this on to a moustache view
			
			var template = fs.readFileSync('invoice/template.html', 'utf8');

			var output = mustache.render(template, {entries: res, total: totalHours, rate: rate, invoiceTotal: invoiceTotal, today: today});
			fs.writeFileSync('invoice/invoice.html', output);
		}

		db.close();


	});

});

