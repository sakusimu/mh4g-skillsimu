'use strict';
var assert = require('power-assert'),
    data = require('../../../test/lib/driver-data.js');

describe('10_driver/01_data', function () {
    var got;

    it('data', function () {
        assert(typeof data, 'object', 'is object');
        assert(typeof data.initialize, 'function', 'has initialize()');
    });

    it('equips', function () {
        var equips = data.equips;

        got = equips.head.length;
        assert(got > 0, 'equips.head.length');

        got = equips.body.length;
        assert(got > 0, 'equips.body.length');

        got = equips.arm.length;
        assert(got > 0, 'equips.arm.length');

        got = equips.waist.length;
        assert(got > 0, 'equips.waist.length');

        got = equips.leg.length;
        assert(got > 0, 'equips.leg.length');
    });

    it('decos', function () {
        got = data.decos.length;
        assert(got > 0, 'decos.length');
    });

    it('skills', function () {
        got = data.skills.length;
        assert(got > 0, 'skills.length');
    });
});
