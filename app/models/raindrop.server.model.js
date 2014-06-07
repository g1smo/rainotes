'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*
 * Raindrop Schema
 */
var PointSchema = new Schema({
    x: Number,
    y: Number
});
var RainDropSchema = new Schema({
    timestamp: {
        type: Date,
		default: Date.now
    },
    color: String,
    size: Number,
    points: [PointSchema]
});

mongoose.model('RainDrop', RainDropSchema);
