'use strict';
var assert = require('power-assert'),
    Deco = require('../../../lib/deco.js');

describe('40_deco/00_deco', function () {
    it('Deco', function () {
        assert(typeof Deco === 'object', 'is object');
    });
});
