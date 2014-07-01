#!/usr/local/bin/node
var 	MongoClient = require('mongodb').MongoClient,
	config = require('./config'),
	format = require('util').format, 
	mustache = require('mustache'),
	moment = require('moment'),
	fs = require('fs');

if(process.argv.length >= 3)
	if(process.argv[3] == 'save')
		var save = process.argv[3];

if(process.argv.length >= 2)
	var company  = process.argv[2];

MongoClient.connect(config.mongo, function(err, db) {
	if(err) throw err;

	db.collection('entries').find({company: company, fetched: null}, {sort: 'starttime'})
		.toArray(function(e, res){
		if(!e) {

			var amount = 0;
			for(var i = 0; i < res.length; i++) {
				res[i]['startString'] = moment(res[i].starttime).format('D/M/YY, h:mm a');;
				res[i]['mins'] = ((Math.round((res[i].endtime - res[i].starttime) / 1000 / 60) * 10 ) / 10);
				amount += (res[i].endtime - res[i].starttime);
			}

			var totalHours = ((Math.round(amount / 1000 / 60 / 60 * 10)) / 10);
			var rate = config.rate;
			var invoiceTotal = rate * totalHours; 
			console.log('Total hours', totalHours, 'total: ', invoiceTotal)
			var today = moment().format('D/M/YY');

			//Pass this on to a moustache view
			var template = fs.readFileSync('template/template.html', 'utf8');

			var output = mustache.render(template, {entries: res, total: totalHours, rate: rate, invoiceTotal: invoiceTotal, today: today, config:config, company: company});
			console.log('written to invoice.html');
			fs.writeFileSync('invoice.html', output);
			
			//if requested to save, it'll mark the entries as 'saved' to prevent them coming up again
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
		}

		db.close();


	});

});

