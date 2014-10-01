'use strict';
var assert = require('power-assert'),
    simu = require('../../lib/namespace.js');

describe('00_namespace', function () {
    it('namespace', function () {
        assert(typeof simu === 'object', 'simu');
        assert(/\d+\.\d+\.\d+/.test(simu.VERSION), 'version');
    });
});
