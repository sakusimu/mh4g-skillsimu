'use strict';
var assert = require('power-assert'),
    Simulator = require('../../lib/simulator.js'),
    myapp = require('../../test/lib/driver-myapp.js');

describe('90_simulator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Simulator === 'function', 'is function');
    });

    it('new', function () {
        var simu = new Simulator();
        assert(typeof simu === 'object', 'is object');
        assert(typeof simu.initialize === 'function', 'has initialize()');

        assert(typeof simu.equip === 'object', 'equip');
        assert(typeof simu.deco === 'object', 'deco');
    });

    it('initialize', function () {
        var simu = new Simulator();

        simu.equip = null;
        simu.deco  = null;

        simu.initialize();
        assert(typeof simu.equip === 'object', 'equip');
        assert(typeof simu.deco === 'object', 'deco');
    });

    describe('simulateEquip', function () {
        var simu = new Simulator();

        it('simulate', function () {
            got = simu.simulateEquip([ '斬れ味レベル+1', '高級耳栓' ]).length;
            exp = 1427;
            assert(got === exp);
        });
    });

    describe('simulateDeco', function () {
        var simu = new Simulator();

        var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

        it('simulate', function () {
            // 装備に胴系統倍化、武器スロ、お守りがある場合
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),  // スロ2
                body  : myapp.equip('body', '三眼の首飾り'),      // スロ3
                arm   : myapp.equip('arm', 'ユクモノコテ・天'),   // スロ2
                waist : myapp.equip('waist', 'バンギスコイル'),   // 胴系統倍化
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'), // スロ2
                weapon: { name: 'slot2' },
                oma   : omas[0]
            };
            got = simu.simulateDeco([ '斬れ味レベル+1', '高級耳栓' ], equipSet).length;
            exp = 3;
            assert(got === exp);
        });
    });
});
