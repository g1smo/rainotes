'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    RainDrop = mongoose.model('RainDrop');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null
	});
};

exports.rainDropSave = function(req, res) {
    var rainDrop = new RainDrop(req.body);
    console.log(rainDrop);
    rainDrop.save(function (err) {
		if (err) {
			return res.send(400);
		} else {
			res.jsonp(rainDrop);
		}
	});
};

exports.rainDropList = function(req, res) {
    RainDrop.find().sort('timestamp').exec(function(err, raindrops) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(raindrops);
		}
	});
};
