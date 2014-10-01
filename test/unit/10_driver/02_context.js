'use strict';
var assert = require('power-assert'),
    Context = require('../../../test/lib/driver-context');

describe('10_driver/02_context', function () {
    var got;

    it('context', function () {
        got = new Context();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');

        assert(got.sex === 'm', 'sex');
        assert(got.type === 'k', 'type');
        assert(got.hr === 8, 'hr');
        assert(got.vs === 6, 'vs');
    });
});
