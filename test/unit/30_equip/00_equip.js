'use strict';
var assert = require('power-assert'),
    Equip = require('../../../lib/equip.js');

describe('30_equip/00_equip', function () {
    it('Equip', function () {
        assert(typeof Equip === 'object', 'is object');
    });
});
