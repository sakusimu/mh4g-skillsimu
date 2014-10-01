'use strict';
var assert = require('power-assert'),
    myapp = require('../../../test/lib/driver-namespace.js');

describe('10_driver/00_namespace', function () {
    it('myapp', function () {
        assert(typeof myapp === 'object', 'myapp');
    });
});
