'use strict';
var assert = require('power-assert'),
    Simulator = require('../../../lib/equip.js'),
    data = require('../../../lib/data.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/simulator', function () {
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
    });

    describe('simulate: torsoUp', function () {
        var simu = new Simulator();

        it('torsoUp', function () {
            myapp.setup({ sex: 'w' });

        var equips = data.equips;
            equips.head  = [ myapp.equip('head', 'ユクモノカサ・天') ];
            equips.body  = [ myapp.equip('body', '三眼の首飾り') ];
            equips.arm   = [ myapp.equip('arm', 'ユクモノコテ・天') ];
            equips.waist = [
                myapp.equip('waist', 'レザーベルト'),
                myapp.equip('waist', 'バンギスコイル'),
                myapp.equip('waist', 'シルバーソルコイル')
            ];
            equips.leg   = [ myapp.equip('leg', 'ユクモノハカマ・天') ];

            got = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ]);
            exp = [ { head  : 'ユクモノカサ・天',
                      body  : '三眼の首飾り',
                      arm   : 'ユクモノコテ・天',
                      waist : '胴系統倍化',
                      leg   : 'ユクモノハカマ・天',
                      weapon: null,
                      oma   : null } ];
            assert.deepEqual(got, exp, 'torsoUp');
        });
    });

    describe('simulate: dig', function () {
        var simu = new Simulator();

        it('dig', function () {
            myapp.setup({
                omas: [
                    [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
                    [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
                    [ '龍の護石',3,'痛撃',4 ]
                ],
                dig: true
            });
            got = simu.simulate([ '真打', '集中', '弱点特効', '耳栓' ]).length;
            exp = 27;
            assert.deepEqual(got, exp, 'dig');
        });
    });

    describe('simulate: summary', function () {
        var simu = new Simulator();

        it("[ '攻撃力UP【大】', '業物' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物' ];
            got = simu.simulate(skills).length;
            exp = 8;
            assert(got === exp);
        });

        it("[ '斬れ味レベル+1', '高級耳栓' ]", function () {
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            got = simu.simulate(skills).length;
            exp = 1427;
            assert(got === exp);
        });

        it("[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]", function () {
            var skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
            got = simu.simulate(skills).length;
            exp = 0;
            assert(got === exp);
        });
    });
});
