'use strict';
var assert = require('power-assert'),
    simu = require('../../index.js');

describe('index', function () {
    it('require', function () {
        assert(typeof simu === 'object', 'is object');
    });

    it('exports', function () {
        assert(/\d+\.\d+\.\d+/.test(simu.VERSION), 'version');
        assert(typeof simu.Simulator === 'function', 'Simulator');
        assert(typeof simu.data === 'object', 'data');
        assert(typeof simu.util === 'object', 'util');
    });

    (global.document ? describe : describe.skip)('Browser', function () {
        /* global window:false */
        it('window.simu', function () {
            assert(window.simu === simu);
        });
    });
});
