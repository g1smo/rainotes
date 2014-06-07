'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);

    // Raindrops
    app.route('/raindrop').post(core.rainDropSave);
    app.route('/raindrop/list').get(core.rainDropList);
};
