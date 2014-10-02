'use strict';
var assert = require('power-assert'),
    Assembler = require('../../../lib/deco/assembler.js');

describe('40_deco/30_assembler', function () {
    it('require', function () {
        assert(typeof Assembler === 'function', 'is function');
    });

    it('new', function () {
        var a = new Assembler();
        assert(typeof a === 'object', 'is object');
        assert(typeof a.initialize === 'function', 'has initialie()');
    });
});
