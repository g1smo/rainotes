'use strict';

module.exports = {
    app: {
        title: 'rainotes',
        description: 'Creative collaborative (cloudy?) expression board',
        keywords: 'collaborative, expression, notes, MongoDB'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/jquery-minicolors/jquery.minicolors.css',
                'public/lib/nouislider/jquery.nouislider.css'
            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/paper/dist/paper-full.js',
                'public/lib/hammerjs/hammer.js',
                'public/lib/angular-hammer/angular-hammer.js',
                'public/lib/underscore/underscore.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/jquery-minicolors/jquery.minicolors.js',
                'public/lib/nouislider/jquery.nouislider.js',
                'public/lib/backbone/backbone.js',
                'public/lib/angular-mousewheel/mousewheel.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
