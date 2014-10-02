'use strict';

module.exports = function(config) {
    config.set({
        basePath: '..',
        frameworks: [ 'mocha' ],
        browsers: [ 'Chrome' ],
        reporters: [ 'mocha' ]
    });
};
