'use strict';
var assert = require('power-assert'),
    util = require('../../../lib/util.js');

describe('20_util/util', function () {
    it('require', function () {
        assert(typeof util === 'object', 'is object');
    });

    it('props', function () {
        assert(typeof util.parts === 'object', 'util: parts');
        assert(typeof util.clone === 'function', 'util: clone');
        assert(typeof util.skill === 'object', 'util.skill');
        assert(typeof util.deco === 'object', 'util.deco');
        assert(typeof util.comb === 'object', 'util.comb');
        assert(typeof util.BorderLine === 'function', 'util.BorderLine');
    });
});
